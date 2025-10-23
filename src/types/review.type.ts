import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType({ description: 'Resena realizada por un cliente.' })
export class ReviewType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => Float)
  rating!: number;

  @Field({ nullable: true })
  comment?: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
