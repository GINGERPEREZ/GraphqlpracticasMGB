import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Métricas de ingresos totales',
})
export class RevenueMetricsType {
  @Field(() => Float, { description: 'Ingresos totales de pagos completados' })
  totalRevenue!: number;

  @Field(() => Float, { description: 'Valor promedio de pago' })
  avgPaymentValue!: number;

  @Field(() => Int, { description: 'Cantidad de pagos completados' })
  totalPayments!: number;
}

@ObjectType({
  description: 'Métricas de reservaciones',
})
export class ReservationMetricsType {
  @Field(() => Int, { description: 'Total de reservaciones' })
  totalReservations!: number;

  @Field(() => Int, { description: 'Reservaciones canceladas' })
  cancelledReservations!: number;

  @Field(() => Float, {
    description: 'Tasa de cancelación (porcentaje)',
  })
  cancellationRate!: number;

  @Field(() => Int, { description: 'Reservaciones confirmadas' })
  confirmedReservations!: number;

  @Field(() => Int, { description: 'Reservaciones completadas' })
  completedReservations!: number;
}

@ObjectType({
  description: 'Métricas de reseñas y calificaciones',
})
export class ReviewMetricsType {
  @Field(() => Float, { description: 'Calificación promedio' })
  avgRating!: number;

  @Field(() => Int, { description: 'Total de reseñas' })
  totalReviews!: number;

  @Field(() => Int, {
    description: 'Cantidad de reseñas con calificación 5',
  })
  fiveStarCount!: number;

  @Field(() => Int, {
    description: 'Cantidad de reseñas con calificación 1',
  })
  oneStarCount!: number;
}

@ObjectType({
  description: 'Métricas consolidadas de negocio (Dashboard KPIs)',
})
export class BusinessKPIsType {
  @Field(() => RevenueMetricsType, { description: 'Métricas de ingresos' })
  revenue!: RevenueMetricsType;

  @Field(() => ReservationMetricsType, {
    description: 'Métricas de reservaciones',
  })
  reservations!: ReservationMetricsType;

  @Field(() => ReviewMetricsType, { description: 'Métricas de reseñas' })
  reviews!: ReviewMetricsType;

  @Field(() => Int, { description: 'Total de usuarios registrados' })
  totalUsers!: number;

  @Field(() => Int, { description: 'Total de restaurantes' })
  totalRestaurants!: number;
}

@ObjectType({
  description: 'Ingresos agrupados por día',
})
export class DailyRevenueType {
  @Field(() => String, { description: 'Fecha (YYYY-MM-DD)' })
  date!: string;

  @Field(() => Float, { description: 'Ingresos del día' })
  revenue!: number;

  @Field(() => Int, { description: 'Cantidad de pagos' })
  paymentCount!: number;
}

@ObjectType({
  description: 'Top restaurante por ingresos',
})
export class TopRestaurantType {
  @Field(() => String, { description: 'ID del restaurante' })
  restaurantId!: string;

  @Field(() => Float, { description: 'Ingresos totales' })
  totalRevenue!: number;

  @Field(() => Int, { description: 'Cantidad de pagos' })
  paymentCount!: number;
}
