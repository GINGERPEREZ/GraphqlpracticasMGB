import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

import { RestaurantType } from './restaurant.type.js';

@ObjectType({
  description: 'Resumen de una reservacion realizada por un usuario.',
})
export class ReservationSummaryType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => ID)
  tableId!: string;

  @Field(() => GraphQLISODateTime)
  reservationDate!: Date;

  @Field()
  reservationTime!: string;

  @Field()
  guestCount!: number;

  @Field()
  status!: string;

  @Field({ nullable: true })
  notes?: string | null;

  @Field(() => RestaurantType, {
    nullable: true,
    description:
      'Restaurante asociado a la reservacion. Resuelto bajo demanda.',
  })
  restaurant?: RestaurantType | null;
}
