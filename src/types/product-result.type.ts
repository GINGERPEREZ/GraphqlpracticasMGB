import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { MenuType } from './menu.type.js';
import { RestaurantType } from './restaurant.type.js';

@ObjectType({ description: 'Representa un producto encontrado.' })
export class ProductResultType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => Int)
  stock!: number;

  @Field(() => String, {
    nullable: true,
    description: 'Identificador del menu (categoria) al que pertenece el plato.',
  })
  menuId?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Nombre del menu/categoria asociado al plato cuando esta disponible.',
  })
  menuName?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Identificador del restaurante proveedor del plato.',
  })
  restaurantId?: string | null;

  @Field(() => MenuType, {
    nullable: true,
    description: 'Menu asociado, resuelto bajo demanda desde la API REST.',
  })
  menu?: MenuType | null;

  @Field(() => RestaurantType, {
    nullable: true,
    description: 'Restaurante asociado, resuelto bajo demanda desde la API REST.',
  })
  restaurant?: RestaurantType | null;

  menuCache?: MenuType | null;

  restaurantCache?: RestaurantType | null;
}
