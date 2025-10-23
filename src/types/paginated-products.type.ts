import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductResultType } from './product-result.type.js';

@ObjectType({ description: 'Respuesta paginada para productos.' })
export class PaginatedProductsType {
  @Field(() => [ProductResultType])
  items!: ProductResultType[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  pages!: number;
}
