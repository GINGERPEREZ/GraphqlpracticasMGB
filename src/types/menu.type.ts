import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Informacion de un menu disponible en un restaurante.',
})
export class MenuType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field({ nullable: true })
  price?: number | null;

  @Field({ nullable: true })
  coverImageUrl?: string | null;
}
