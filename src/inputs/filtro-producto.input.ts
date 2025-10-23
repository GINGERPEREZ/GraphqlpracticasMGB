import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType({ description: 'Filtro avanzado para buscar platillos (dishes).' })
export class FiltroProductoInput {
  @Field(() => String, { nullable: true, description: 'Busqueda por nombre (contiene).' })
  nombre?: string;

  @Field(() => Float, { nullable: true, description: 'Precio minimo.' })
  precioMin?: number;

  @Field(() => Float, { nullable: true, description: 'Precio maximo.' })
  precioMax?: number;

  @Field(() => ID, { nullable: true, description: 'Restaurant id.' })
  restaurantId?: string;

  @Field(() => ID, { nullable: true, description: 'Menu id.' })
  menuId?: string;

  @Field(() => String, { nullable: true, description: 'Menu name (category name) para buscar por nombre de categoria.' })
  menuName?: string;
}
