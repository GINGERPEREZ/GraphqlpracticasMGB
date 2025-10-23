# Plan de trabajo - Taller 5

## Objetivo general

Construir un Gateway GraphQL (puerto 3001) con NestJS que consuma la API REST existente del Taller 4 (puerto 3000) bajo un enfoque **code-first**.

```
Cliente → Gateway GraphQL (NestJS) → API REST (NestJS) → SQLite
```

## Arquitectura base del repositorio

- `src/types`: Tipos GraphQL reutilizables (`@ObjectType`).
- `src/inputs`: Entradas compartidas (`@InputType`).
- `src/common/rest`: Cliente reutilizable para consumir la API REST.
- `src/agregacion`: Módulo completo para Integrante 1.
- `src/analytics`: Espacio reservado para Integrante 2.
- `src/busqueda`: Espacio reservado para Integrante 3.

Cada módulo expone su propio resolver y servicios. `AppModule` registra `GraphQLModule` con `ApolloDriver`, esquemas auto-generados en `src/schema.gql` y agrega los tres paquetes funcionales.

## División de responsabilidades

### Integrante 1 – Módulo `agregacion`

- Queries implementadas:
  1. `perfilUsuario(id: ID!)`: Perfil enriquecido del usuario con últimas 3 reservas y pagos, más el gasto total.
  2. `productoDetallado(id: ID!)`: Información completa de un plato, su menú, restaurante y 5 reseñas más recientes.
  3. `resumenGeneral`: Métricas globales (clientes, platos, ventas del día).
- Utiliza `AgregacionService` y resolvers auxiliares (`ReservationSummaryResolver`, `PaymentSummaryResolver`) para `@ResolveField`.
- Se apoya en `RestClientService` para llamadas REST.

### Integrante 2 – Módulo `analytics`

- Utilizar el patrón del módulo `agregacion` como guía.
- Definir 3 queries de análisis/BI que combinen múltiples entidades (ej.: rentabilidad semanal, rotación de mesas, top clientes).
- Crear tipos específicos dentro del módulo (`src/analytics/types`) conforme se necesiten.
- Reutilizar `RestClientService` para traer datos, aplicando lógica de agregación en el resolver.

### Integrante 3 – Módulo `busqueda`

- Implementar 3 queries orientadas a búsquedas avanzadas (ej.: búsqueda por texto, sugerencias personalizadas, disponibilidad de mesas).
- Definir inputs específicos (`src/inputs`) si se requieren filtros complejos.
- Mantener la lógica de composición en los resolvers y apoyarse en servicios dedicados.

## Buenas prácticas acordadas

- **Code-first**: Todos los tipos e inputs con decoradores (`@ObjectType`, `@InputType`, `@Field`).
- **Documentación**: Cada query y campo significativo debe llevar `description`.
- **Relaciones**: Resolver con `@ResolveField` para diferir llamadas a la API REST.
- **HTTP Client**: Solo usar `RestClientService` para consumir la API REST (evita duplicar lógica de errores/paginación).
- **Paginación**: Emplear el helper de paginado (`getAllPaginated`) cuando se requiera recorrer grandes conjuntos.
- **Configuración**: `REST_API_URL` configurable por `env`; si no se define, apunta a `http://localhost:3000`.
- **Testing manual**: Exponer en Slack o repositorio ejemplos de queries GraphQL para validar integración.

## Próximos pasos sugeridos

1. Cada integrante define y documenta sus 3 queries antes de programar (evita traslapes).
2. Implementar los resolvers y servicios correspondientes.
3. Registrar nuevos tipos/inputs en sus módulos.
4. Ejecutar `npm run start:dev` y verificar el esquema generado (`src/schema.gql`).
5. Preparar scripts de prueba (Document Explorer o collection) para QA interno.
