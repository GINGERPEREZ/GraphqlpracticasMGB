import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

import { ReservationSummaryType } from './reservation.type.js';
import { UserType } from './user.type.js';

@ObjectType({ description: 'Resumen de un pago registrado en la API REST.' })
export class PurchaseType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  reservationId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => String)
  currency!: string;

  @Field(() => GraphQLISODateTime)
  paidAt!: Date;

  @Field(() => ReservationSummaryType, {
    nullable: true,
    description: 'Reservacion asociada al pago, resuelta bajo demanda.',
  })
  reservation?: ReservationSummaryType | null;

  @Field(() => UserType, {
    nullable: true,
    description: 'Usuario que realizo el pago, resuelto bajo demanda.',
  })
  user?: UserType | null;
}
