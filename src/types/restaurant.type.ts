import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Informacion basica de un restaurante.' })
export class RestaurantType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field()
  address!: string;

  @Field({ nullable: true })
  openingHours?: string | null;

  @Field()
  capacity!: number;

  @Field({ nullable: true })
  imageId?: string | null;

  @Field({ nullable: true })
  imageUrl?: string | null;
}
