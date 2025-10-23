# Gateway GraphQL - Taller 5

Este proyecto implementa un **Gateway GraphQL** con NestJS (puerto 3001) que consume la API REST del Taller 4 (puerto 3000). Se trabaja con enfoque _code-first_ para mantener un esquema tipado y documentado mediante decoradores.

## Requisitos previos

- Node.js 20+
- API REST del Taller 4 en ejecución (`http://localhost:3000` por defecto)
- Variables de entorno opcionales:
  - `PORT`: Puerto para el Gateway GraphQL (default: `3001`).
  - `REST_API_URL`: URL base de la API REST (default: `http://localhost:3000`).

## Instalación

```powershell
npm install
```

## Ejecución en desarrollo

```powershell
npm run start:dev
```

El servidor expone el _playground_ GraphQL en `http://localhost:3001/graphql`.

## Arquitectura de carpetas

```

  common/rest        # Cliente HTTP contra la API REST
  types              # Tipos GraphQL compartidos
  inputs             # Inputs GraphQL compartidos
  agregacion         # Módulo asignado al Integrante 1
  analytics          # Espacio reservado al Integrante 2
  busqueda           # Espacio reservado al Integrante 3
```

- `GraphQLModule` se configura en `AppModule` para generar el esquema automáticamente (`src/schema.gql`).
- `RestClientService` centraliza las llamadas HTTP y el manejo de errores.
- Cada módulo define resolvers, servicios y tipos específicos.

## Queries implementadas (Integrante 1)

1. `perfilUsuario(id: ID!)`
   - Devuelve datos del usuario, sus últimas 3 reservas y 3 pagos, y el gasto total acumulado.
2. `productoDetallado(id: ID!)`
   - Combina información del plato, menú, restaurante y las 5 reseñas más recientes.
3. `resumenGeneral`
   - Muestra métricas generales: total de clientes, total de platos y ventas del día actual.

Resolutores adicionales (`@ResolveField`) permiten cargar relaciones bajo demanda (restaurante de la reserva, reserva de un pago, etc.).

## Próximos pasos para el equipo

- Revisar el documento `docs/plan-equipo.md` con la distribución detallada de tareas.
- Integrante 2 (Analytics) y 3 (Búsqueda) deben definir sus queries antes de implementar.
- Reutilizar `RestClientService` en los nuevos módulos para mantener consistencia.
- Documentar cada query con descripciones claras y ejemplos de uso.

## Testing manual sugerido

1. Levantar la API REST del Taller 4 (puerto 3000).
2. Levantar este Gateway (`npm run start:dev`).
3. Abrir `http://localhost:3001/graphql` y ejecutar las queries de ejemplo.
4. Validar que los datos coinciden con las respuestas de la API REST.

---

Cualquier duda o ajuste de arquitectura debe discutirse en equipo antes de modificar los módulos compartidos.
With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
