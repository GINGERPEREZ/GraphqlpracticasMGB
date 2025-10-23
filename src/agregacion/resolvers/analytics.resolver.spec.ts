import { Test, TestingModule } from '@nestjs/testing';

import { AnalyticsResolver } from './analytics.resolver';
import { AnalyticsService } from '../services/analytics.service';
import type {
  RestPayment,
  RestReservation,
  RestReview,
  RestUser,
  RestRestaurant,
} from '../../common/rest/rest.types';

describe('AnalyticsResolver', () => {
  let resolver: AnalyticsResolver;
  let service: AnalyticsService;

  const mockPayments: RestPayment[] = [
    {
      id: '1',
      reservationId: 'r1',
      userId: 'u1',
      amount: 100,
      currency: 'USD',
      method: 'CARD',
      status: 'PAID',
      paidAt: '2025-10-20T10:00:00Z',
    },
    {
      id: '2',
      reservationId: 'r2',
      userId: 'u2',
      amount: 200,
      currency: 'USD',
      method: 'CASH',
      status: 'PAID',
      paidAt: '2025-10-21T12:00:00Z',
    },
    {
      id: '3',
      reservationId: 'r3',
      userId: 'u3',
      amount: 150,
      currency: 'USD',
      method: 'CARD',
      status: 'PENDING',
      paidAt: '2025-10-22T14:00:00Z',
    },
  ];

  const mockReservations: RestReservation[] = [
    {
      id: 'r1',
      userId: 'u1',
      restaurantId: 'rest1',
      tableId: 't1',
      reservationDate: '2025-10-20',
      reservationTime: '19:00',
      guestCount: 4,
      status: 'CONFIRMED',
    },
    {
      id: 'r2',
      userId: 'u2',
      restaurantId: 'rest1',
      tableId: 't2',
      reservationDate: '2025-10-21',
      reservationTime: '20:00',
      guestCount: 2,
      status: 'CANCELLED',
    },
    {
      id: 'r3',
      userId: 'u3',
      restaurantId: 'rest2',
      tableId: 't3',
      reservationDate: '2025-10-22',
      reservationTime: '18:30',
      guestCount: 6,
      status: 'COMPLETED',
    },
  ];

  const mockReviews: RestReview[] = [
    {
      id: 'rev1',
      userId: 'u1',
      restaurantId: 'rest1',
      rating: 5,
      comment: 'Excellent',
      createdAt: '2025-10-20T10:00:00Z',
    },
    {
      id: 'rev2',
      userId: 'u2',
      restaurantId: 'rest1',
      rating: 4,
      comment: 'Good',
      createdAt: '2025-10-21T11:00:00Z',
    },
    {
      id: 'rev3',
      userId: 'u3',
      restaurantId: 'rest2',
      rating: 1,
      comment: 'Bad',
      createdAt: '2025-10-22T12:00:00Z',
    },
  ];

  const mockUsers: RestUser[] = [
    { id: 'u1', email: 'user1@test.com', names: 'User One', phone: '1111' },
    { id: 'u2', email: 'user2@test.com', names: 'User Two', phone: '2222' },
    { id: 'u3', email: 'user3@test.com', names: 'User Three', phone: '3333' },
  ];

  const mockRestaurants: RestRestaurant[] = [
    {
      id: 'rest1',
      name: 'Restaurant One',
      address: '123 Main St',
      capacity: 50,
    },
    {
      id: 'rest2',
      name: 'Restaurant Two',
      address: '456 Oak Ave',
      capacity: 30,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsResolver,
        {
          provide: AnalyticsService,
          useValue: {
            getAllPayments: jest.fn().mockResolvedValue(mockPayments),
            getAllReservations: jest.fn().mockResolvedValue(mockReservations),
            getAllReviews: jest.fn().mockResolvedValue(mockReviews),
            getAllUsers: jest.fn().mockResolvedValue(mockUsers),
            getAllRestaurants: jest.fn().mockResolvedValue(mockRestaurants),
          },
        },
      ],
    }).compile();

    resolver = module.get<AnalyticsResolver>(AnalyticsResolver);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('businessKPIs', () => {
    it('should calculate total revenue correctly (only PAID payments)', async () => {
      const result = await resolver.businessKPIs();
      expect(result.revenue.totalRevenue).toBe(300); // 100 + 200
      expect(result.revenue.totalPayments).toBe(2);
    });

    it('should calculate average payment value correctly', async () => {
      const result = await resolver.businessKPIs();
      expect(result.revenue.avgPaymentValue).toBe(150); // 300 / 2
    });

    it('should calculate cancellation rate correctly', async () => {
      const result = await resolver.businessKPIs();
      expect(result.reservations.totalReservations).toBe(3);
      expect(result.reservations.cancelledReservations).toBe(1);
      expect(result.reservations.cancellationRate).toBeCloseTo(33.33, 1);
    });

    it('should calculate average rating correctly', async () => {
      const result = await resolver.businessKPIs();
      expect(result.reviews.avgRating).toBeCloseTo(3.33, 1); // (5+4+1)/3
      expect(result.reviews.totalReviews).toBe(3);
    });

    it('should count 5-star and 1-star reviews', async () => {
      const result = await resolver.businessKPIs();
      expect(result.reviews.fiveStarCount).toBe(1);
      expect(result.reviews.oneStarCount).toBe(1);
    });

    it('should return total users and restaurants', async () => {
      const result = await resolver.businessKPIs();
      expect(result.totalUsers).toBe(3);
      expect(result.totalRestaurants).toBe(2);
    });
  });

  describe('revenueMetrics', () => {
    it('should return revenue metrics', async () => {
      const result = await resolver.revenueMetrics();
      expect(result.totalRevenue).toBe(300);
      expect(result.avgPaymentValue).toBe(150);
      expect(result.totalPayments).toBe(2);
    });
  });

  describe('dailyRevenue', () => {
    it('should group revenue by date', async () => {
      const result = await resolver.dailyRevenue();
      expect(result).toHaveLength(2); // 2 days with paid payments
      expect(result[0].date).toBe('2025-10-20');
      expect(result[0].revenue).toBe(100);
      expect(result[0].paymentCount).toBe(1);
      expect(result[1].date).toBe('2025-10-21');
      expect(result[1].revenue).toBe(200);
      expect(result[1].paymentCount).toBe(1);
    });

    it('should sort by date ascending', async () => {
      const result = await resolver.dailyRevenue();
      for (let i = 1; i < result.length; i++) {
        expect(result[i].date >= result[i - 1].date).toBe(true);
      }
    });
  });

  describe('topRestaurantsByRevenue', () => {
    it('should rank restaurants by revenue descending', async () => {
      const result = await resolver.topRestaurantsByRevenue();
      expect(result).toHaveLength(2); // rest1 and rest2
      expect(result[0].totalRevenue).toBeGreaterThanOrEqual(
        result[1].totalRevenue,
      );
    });

    it('should map payments to restaurants via reservations', async () => {
      const result = await resolver.topRestaurantsByRevenue();
      const rest1 = result.find((r) => r.restaurantId === 'rest1');
      expect(rest1).toBeDefined();
      expect(rest1!.totalRevenue).toBe(300); // payment 1 (r1->rest1) + payment 2 (r2->rest1)
      expect(rest1!.paymentCount).toBe(2);
    });
  });
});
