import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Informacion detallada de un plato del menu.' })
export class DishType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => ID)
  menuId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Float)
  price!: number;

  @Field(() => String, { nullable: true })
  imageId?: string | null;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;
}
