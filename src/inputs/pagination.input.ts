import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: 'Parmetros de paginacion estandar.' })
export class PaginationInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Numero de elementos a omitir.',
  })
  offset?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Numero maximo de elementos a recuperar.',
  })
  limit?: number;
}
