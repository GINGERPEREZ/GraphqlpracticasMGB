import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Representa un usuario dentro del dominio REST.' })
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  names!: string;

  @Field()
  phone!: string;
}
