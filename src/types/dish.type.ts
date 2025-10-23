import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Informacion detallada de un plato del menu.' })
export class DishType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => ID)
  menuId!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field(() => Float)
  price!: number;

  @Field({ nullable: true })
  imageId?: string | null;

  @Field({ nullable: true })
  imageUrl?: string | null;
}
