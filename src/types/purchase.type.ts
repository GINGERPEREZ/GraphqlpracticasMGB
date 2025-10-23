import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

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
}
