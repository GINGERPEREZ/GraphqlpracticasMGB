import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Informacion de un menu disponible en un restaurante.',
})
export class MenuType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Float, { nullable: true })
  price?: number | null;

  @Field(() => String, { nullable: true })
  coverImageUrl?: string | null;
}
