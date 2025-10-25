# Gateway GraphQL - Sistema de Reservas de Restaurantes

## 📋 Descripción

**Gateway GraphQL** construido con **NestJS** que actúa como capa de abstracción sobre la API REST del sistema MesaYa. Este gateway consume la API REST (puerto 3000) y expone un esquema GraphQL unificado (puerto 3001), permitiendo consultas más flexibles y eficientes.

### Características principales

* 🔄 **Gateway GraphQL** - Capa de abstracción sobre API REST
* 📊 **Code-First** - Esquema GraphQL generado automáticamente desde decoradores TypeScript
* 🔍 **Consultas agregadas** - Combina múltiples endpoints REST en una sola query
* 📈 **Analytics** - Métricas y estadísticas del sistema
* 🔎 **Búsqueda avanzada** - Filtros y búsquedas complejas
* 📖 **Documentación interactiva** - GraphQL Playground incluido
* 🎯 **Resolvers optimizados** - Carga de datos bajo demanda con @ResolveField

## 🏗️ Arquitectura

```
src/
├── agregacion/          # Módulo de agregación (Integrante 1)
│   ├── resolvers/      # Resolvers de queries agregadas
│   └── services/       # Servicios de agregación
├── analytics/          # Módulo de analytics (Integrante 2)
├── busqueda/          # Módulo de búsqueda (Integrante 3)
├── common/
│   └── rest/          # Cliente HTTP para API REST
├── types/             # Tipos GraphQL compartidos
├── inputs/            # Input types GraphQL
├── app.module.ts      # Módulo principal
├── main.ts           # Punto de entrada
└── schema.gql        # Esquema GraphQL generado
```

## 🚀 Instalación

### Prerrequisitos

* Node.js 20+ instalado
* API REST del Taller 4 en ejecución (`http://localhost:3000`)
* npm o yarn

### Variables de entorno

Puedes configurar opcionalmente:

* `PORT` - Puerto para el Gateway GraphQL (default: `3001`)
* `REST_API_URL` - URL base de la API REST (default: `http://localhost:3000`)

### Pasos de instalación

1. **Navegar al directorio del proyecto**

   ```powershell
   cd 1er-parcial/activities/act_5_graphql
   ```

2. **Instalar dependencias**

   ```powershell
   npm install
   ```

## 💻 Ejecución

### Modo desarrollo

```powershell
# Iniciar en modo desarrollo con recarga automática
npm run start:dev
```

El Gateway GraphQL estará disponible en `http://localhost:3001`

### Acceder al GraphQL Playground

Una vez iniciado el servidor, visita:

```
http://localhost:3001/graphql
```

Aquí encontrarás:

* 🎮 Interfaz interactiva para ejecutar queries
* 📖 Documentación automática del esquema
* 🔍 Explorador de tipos y campos
* ✅ Autocompletado de queries

### Otros comandos

```powershell
# Modo producción
npm run build
npm run start:prod

# Ejecutar sin watch
npm start

# Modo debug
npm run start:debug
```

## 📊 Queries implementadas

### 1. Perfil de Usuario (perfilUsuario)

Obtiene el perfil completo de un usuario incluyendo sus últimas reservas, pagos y gasto total.

**Query:**

```graphql
query {
  perfilUsuario(id: "1") {
    id
    name
    email
    phone
    ultimasReservas {
      reservationId
      date
      numberOfGuests
      status
    }
    ultimosPagos {
      paymentId
      amount
      date
      paymentStatus
    }
    gastoTotal
  }
}
```

**Características:**

* Últimas 3 reservas del usuario
* Últimos 3 pagos realizados
* Gasto total acumulado
* Datos combinados de múltiples endpoints REST

### 2. Producto Detallado (productoDetallado)

Información completa de un platillo con su menú, restaurante y reseñas.

**Query:**

```graphql
query {
  productoDetallado(id: "1") {
    dishId
    dishName
    description
    price
    category
    menu {
      menuId
      menuName
      restaurant {
        restaurantId
        name
        address
      }
    }
    ultimasResenias {
      reviewId
      rating
      comment
      reviewDate
    }
  }
}
```

**Características:**

* Datos del platillo
* Información del menú asociado
* Datos del restaurante
* Últimas 5 reseñas del platillo

### 3. Resumen General (resumenGeneral)

Métricas y estadísticas generales del sistema.

**Query:**

```graphql
query {
  resumenGeneral {
    totalClientes
    totalPlatos
    ventasHoy
  }
}
```

**Características:**

* Total de clientes registrados
* Total de platillos disponibles
* Ventas del día actual

### Resolvers adicionales

El sistema incluye **@ResolveField** para cargar relaciones bajo demanda:

* Restaurante de una reserva
* Reserva asociada a un pago
* Y más...

## 🛠️ Tecnologías utilizadas

* **NestJS** - Framework backend progresivo
* **GraphQL** - Lenguaje de consultas para APIs
* **@nestjs/graphql** - Integración GraphQL para NestJS
* **Code-First** - Generación de esquema desde TypeScript
* **Apollo Server** - Servidor GraphQL
* **TypeScript** - Lenguaje con tipado estático
* **Axios** - Cliente HTTP para consumir API REST

## 🎯 Code-First vs Schema-First

Este proyecto utiliza el enfoque **Code-First**:

* ✅ Esquema GraphQL generado automáticamente
* ✅ Tipado fuerte con TypeScript
* ✅ Decoradores para definir tipos GraphQL
* ✅ Sin archivos `.graphql` manuales
* ✅ `schema.gql` generado automáticamente

## 🔗 Integración con API REST

El gateway consume la API REST mediante:

* **RestClientService** - Cliente HTTP centralizado
* Manejo de errores consistente
* Transformación de respuestas REST a tipos GraphQL
* Caché y optimización de peticiones

## 👥 Trabajo en equipo

### Distribución de módulos

1. **Integrante 1 - Agregación** ✅
   * Query: perfilUsuario
   * Query: productoDetallado
   * Query: resumenGeneral

2. **Integrante 2 - Analytics** 🚧
   * Métricas avanzadas
   * Reportes y estadísticas
   * Consultar `docs/ANALYTICS_README.md`

3. **Integrante 3 - Búsqueda** 🚧
   * Búsquedas complejas
   * Filtros avanzados
   * Consultar `docs/plan-equipo.md`

### Guía para el equipo

Para agregar nuevas queries:

1. Crear resolver en tu módulo
2. Definir tipos GraphQL con decoradores
3. Reutilizar `RestClientService` para llamadas REST
4. Documentar con descripciones claras
5. Actualizar esquema automáticamente

## 🧪 Testing

### Testing manual sugerido

1. **Levantar API REST** (puerto 3000)

   ```powershell
   cd ../act_4_rest
   npm run start:dev
   ```

2. **Levantar Gateway GraphQL** (puerto 3001)

   ```powershell
   cd ../act_5_graphql
   npm run start:dev
   ```

3. **Abrir GraphQL Playground**

   Visita `http://localhost:3001/graphql`

4. **Ejecutar queries de ejemplo**

   Prueba las queries documentadas arriba

### Validación

* ✅ Verificar que los datos coincidan con la API REST
* ✅ Probar resolvers de campos anidados
* ✅ Validar manejo de errores

## 📝 Ejemplos de uso

### Query compleja con campos anidados

```graphql
query {
  perfilUsuario(id: "1") {
    id
    name
    ultimasReservas {
      reservationId
      restaurante {
        restaurantId
        name
        address
      }
      mesa {
        tableId
        tableNumber
      }
    }
    ultimosPagos {
      paymentId
      amount
      reserva {
        reservationId
        date
      }
    }
  }
}
```

### Múltiples queries en una sola petición

```graphql
query {
  resumen: resumenGeneral {
    totalClientes
    totalPlatos
    ventasHoy
  }

  usuario: perfilUsuario(id: "1") {
    name
    gastoTotal
  }

  plato: productoDetallado(id: "5") {
    dishName
    price
  }
}
```

## 🔮 Próximos pasos

* Implementar mutations (crear, actualizar, eliminar)
* Añadir subscriptions para datos en tiempo real
* Implementar DataLoader para evitar N+1 queries
* Añadir caché con Redis
* Implementar paginación
* Agregar autenticación y autorización
* Optimizar consultas REST

## 📖 Recursos

* [Documentación de NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
* [GraphQL Official Docs](https://graphql.org/learn/)
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

## 📋 Documentación adicional

* `docs/ANALYTICS_README.md` - Documentación del módulo Analytics
* `docs/plan-equipo.md` - Plan detallado de distribución de tareas

---

**Proyecto académico** - Aplicaciones para el servidor web | 5to semestre | ULEAM

**Importante**: Antes de ejecutar este gateway, asegúrate de que la API REST (act_4_rest) esté corriendo en el puerto 3000.
