import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Informacion basica de un restaurante.' })
export class RestaurantType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String)
  address!: string;

  @Field(() => String, { nullable: true })
  openingHours?: string | null;

  @Field(() => Int)
  capacity!: number;

  @Field(() => String, { nullable: true })
  imageId?: string | null;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;
}
