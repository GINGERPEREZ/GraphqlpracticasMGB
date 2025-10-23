import { Field, ObjectType } from '@nestjs/graphql';

import { DishType } from '../../types/dish.type.js';
import { MenuType } from '../../types/menu.type.js';
import { RestaurantType } from '../../types/restaurant.type.js';
import { ReviewType } from '../../types/review.type.js';

@ObjectType({ description: 'Detalle completo de un plato con su contexto.' })
export class ProductoDetalladoType {
  @Field(() => DishType)
  plato!: DishType;

  @Field(() => MenuType)
  menu!: MenuType;

  @Field(() => RestaurantType)
  restaurante!: RestaurantType;

  @Field(() => [ReviewType])
  ultimasResenas!: ReviewType[];
}
