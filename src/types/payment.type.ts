import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

import { ReservationSummaryType } from './reservation.type.js';

@ObjectType({ description: 'Resumen de un pago asociado a una reservacion.' })
export class PaymentSummaryType {
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

  @Field(() => String)
  method!: string;

  @Field(() => String)
  status!: string;

  @Field(() => GraphQLISODateTime)
  paidAt!: Date;

  @Field(() => String, { nullable: true })
  reference?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => ReservationSummaryType, {
    nullable: true,
    description: 'Reservacion asociada, resuelta bajo demanda.',
  })
  reservation?: ReservationSummaryType | null;
}
