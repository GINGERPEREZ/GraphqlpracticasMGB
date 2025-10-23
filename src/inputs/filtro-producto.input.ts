import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType({ description: 'Filtro avanzado para buscar productos.' })
export class FiltroProductoInput {
  @Field(() => String, { nullable: true, description: 'Busqueda por nombre (contiene).' })
  nombre?: string;

  @Field(() => Float, { nullable: true, description: 'Precio minimo.' })
  precioMin?: number;

  @Field(() => Float, { nullable: true, description: 'Precio maximo.' })
  precioMax?: number;

  @Field(() => ID, { nullable: true, description: 'Categoria id.' })
  categoriaId?: string;

  @Field(() => Int, { nullable: true, description: 'Stock minimo.' })
  stockMin?: number;
}
