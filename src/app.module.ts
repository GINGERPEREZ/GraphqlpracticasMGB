import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'node:path';
import { AgregacionModule } from './agregacion/agregacion.module.js';
import { BusquedaModule } from './busqueda/busqueda.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
      // Apollo Sandbox para desarrollo local (recomendado desde 2025)
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    AgregacionModule,
    BusquedaModule,
  ],
})
export class AppModule {}
