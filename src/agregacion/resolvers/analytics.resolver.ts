import { Query, Resolver } from '@nestjs/graphql';

import { AnalyticsService } from '../services/analytics.service.js';
import {
  BusinessKPIsType,
  DailyRevenueType,
  ReservationMetricsType,
  RevenueMetricsType,
  ReviewMetricsType,
  TopRestaurantType,
} from '../types/analytics.type.js';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => BusinessKPIsType, {
    name: 'businessKPIs',
    description:
      'Métricas consolidadas de negocio: ingresos, reservas, reseñas, usuarios y restaurantes',
  })
  async businessKPIs(): Promise<BusinessKPIsType> {
    const [payments, reservations, reviews, users, restaurants] =
      await Promise.all([
        this.analyticsService.getAllPayments(),
        this.analyticsService.getAllReservations(),
        this.analyticsService.getAllReviews(),
        this.analyticsService.getAllUsers(),
        this.analyticsService.getAllRestaurants(),
      ]);

    // Revenue metrics
    const paidPayments = payments.filter((p) => p.status === 'PAID');
    const totalRevenue = paidPayments.reduce((s, p) => s + p.amount, 0);
    const avgPaymentValue =
      paidPayments.length > 0 ? totalRevenue / paidPayments.length : 0;

    const revenue: RevenueMetricsType = {
      totalRevenue,
      avgPaymentValue,
      totalPayments: paidPayments.length,
    };

    // Reservation metrics
    const cancelled = reservations.filter((r) => r.status === 'CANCELLED');
    const confirmed = reservations.filter((r) => r.status === 'CONFIRMED');
    const completed = reservations.filter((r) => r.status === 'COMPLETED');
    const cancellationRate =
      reservations.length > 0
        ? (cancelled.length / reservations.length) * 100
        : 0;

    const reservationMetrics: ReservationMetricsType = {
      totalReservations: reservations.length,
      cancelledReservations: cancelled.length,
      confirmedReservations: confirmed.length,
      completedReservations: completed.length,
      cancellationRate,
    };

    // Review metrics
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
    const oneStarCount = reviews.filter((r) => r.rating === 1).length;

    const reviewMetrics: ReviewMetricsType = {
      avgRating,
      totalReviews: reviews.length,
      fiveStarCount,
      oneStarCount,
    };

    return {
      revenue,
      reservations: reservationMetrics,
      reviews: reviewMetrics,
      totalUsers: users.length,
      totalRestaurants: restaurants.length,
    };
  }

  @Query(() => RevenueMetricsType, {
    name: 'revenueMetrics',
    description: 'Métricas detalladas de ingresos',
  })
  async revenueMetrics(): Promise<RevenueMetricsType> {
    const payments = await this.analyticsService.getAllPayments();
    const paid = payments.filter((p) => p.status === 'PAID');
    const totalRevenue = paid.reduce((s, p) => s + p.amount, 0);
    const avgPaymentValue = paid.length > 0 ? totalRevenue / paid.length : 0;

    return {
      totalRevenue,
      avgPaymentValue,
      totalPayments: paid.length,
    };
  }

  @Query(() => ReservationMetricsType, {
    name: 'reservationMetrics',
    description: 'Métricas detalladas de reservaciones',
  })
  async reservationMetrics(): Promise<ReservationMetricsType> {
    const reservations = await this.analyticsService.getAllReservations();
    const cancelled = reservations.filter((r) => r.status === 'CANCELLED');
    const confirmed = reservations.filter((r) => r.status === 'CONFIRMED');
    const completed = reservations.filter((r) => r.status === 'COMPLETED');
    const cancellationRate =
      reservations.length > 0
        ? (cancelled.length / reservations.length) * 100
        : 0;

    return {
      totalReservations: reservations.length,
      cancelledReservations: cancelled.length,
      confirmedReservations: confirmed.length,
      completedReservations: completed.length,
      cancellationRate,
    };
  }

  @Query(() => ReviewMetricsType, {
    name: 'reviewMetrics',
    description: 'Métricas de calificaciones y reseñas',
  })
  async reviewMetrics(): Promise<ReviewMetricsType> {
    const reviews = await this.analyticsService.getAllReviews();
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
    const oneStarCount = reviews.filter((r) => r.rating === 1).length;

    return {
      avgRating,
      totalReviews: reviews.length,
      fiveStarCount,
      oneStarCount,
    };
  }

  @Query(() => [DailyRevenueType], {
    name: 'dailyRevenue',
    description: 'Ingresos agrupados por día (últimos N días con pagos)',
  })
  async dailyRevenue(): Promise<DailyRevenueType[]> {
    const payments = await this.analyticsService.getAllPayments();
    const paid = payments.filter((p) => p.status === 'PAID');

    const byDate = paid.reduce<
      Record<string, { revenue: number; count: number }>
    >((acc, p) => {
      const date = p.paidAt.split('T')[0]; // Extract YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { revenue: 0, count: 0 };
      }
      acc[date].revenue += p.amount;
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.entries(byDate)
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        paymentCount: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  @Query(() => [TopRestaurantType], {
    name: 'topRestaurantsByRevenue',
    description:
      'Restaurantes ordenados por ingresos totales (basado en reservationId de pagos)',
  })
  async topRestaurantsByRevenue(): Promise<TopRestaurantType[]> {
    const payments = await this.analyticsService.getAllPayments();
    const reservations = await this.analyticsService.getAllReservations();
    const paid = payments.filter((p) => p.status === 'PAID');

    // Map reservationId -> restaurantId
    const reservationMap = new Map<string, string>();
    reservations.forEach((r) => {
      reservationMap.set(r.id, r.restaurantId);
    });

    // Group by restaurantId
    const byRestaurant = paid.reduce<
      Record<string, { revenue: number; count: number }>
    >((acc, p) => {
      const restaurantId = reservationMap.get(p.reservationId) ?? 'unknown';
      if (!acc[restaurantId]) {
        acc[restaurantId] = { revenue: 0, count: 0 };
      }
      acc[restaurantId].revenue += p.amount;
      acc[restaurantId].count += 1;
      return acc;
    }, {});

    return Object.entries(byRestaurant)
      .map(([restaurantId, data]) => ({
        restaurantId,
        totalRevenue: data.revenue,
        paymentCount: data.count,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }
}
