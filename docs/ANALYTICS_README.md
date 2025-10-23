# Analytics Module - NestJS GraphQL

## 🎯 Propósito

Este módulo convierte datos crudos de `act_4_rest` en **métricas, estadísticas y KPIs de negocio** mediante consultas GraphQL.

### Enfoque

- **Entrada**: Datos crudos de la API REST (usando `RestClientService`)
- **Salida**: Métricas, KPIs y comparaciones estadísticas
- **Lógica**: Cálculos con `.filter()`, `.reduce()`, `.map()`, agrupaciones y ordenamientos

---

## 🏗️ Arquitectura

### Archivos Principales

1. **`services/analytics.service.ts`**

   - Llama a los endpoints REST de `act_4_rest`
   - Métodos: `getAllPayments()`, `getAllReservations()`, `getAllUsers()`, `getAllReviews()`, `getAllRestaurants()`

2. **`resolvers/analytics.resolver.ts`**

   - Contiene toda la lógica de cálculo y procesamiento
   - Expone queries GraphQL que retornan métricas tipadas

3. **`types/analytics.type.ts`**
   - Define los tipos GraphQL para las respuestas:
     - `BusinessKPIsType`: KPIs consolidados
     - `RevenueMetricsType`: Métricas de ingresos
     - `ReservationMetricsType`: Métricas de reservaciones
     - `ReviewMetricsType`: Métricas de calificaciones
     - `DailyRevenueType`: Ingresos agrupados por día
     - `TopRestaurantType`: Restaurantes top por ingresos

---

## 🔍 Queries Disponibles

### 1. `businessKPIs`

**Descripción**: Métricas consolidadas de negocio (dashboard ejecutivo).

**Retorna**: Objeto con:

- `revenue`: Ingresos totales, promedio, cantidad de pagos
- `reservations`: Total, canceladas, confirmadas, completadas, tasa de cancelación
- `reviews`: Calificación promedio, total, cantidad 5 estrellas, cantidad 1 estrella
- `totalUsers`: Total de usuarios
- `totalRestaurants`: Total de restaurantes

**Ejemplo de uso (GraphQL)**:

```graphql
query {
  businessKPIs {
    revenue {
      totalRevenue
      avgPaymentValue
      totalPayments
    }
    reservations {
      totalReservations
      cancellationRate
    }
    reviews {
      avgRating
      totalReviews
    }
    totalUsers
    totalRestaurants
  }
}
```

---

### 2. `revenueMetrics`

**Descripción**: Métricas detalladas de ingresos.

**Retorna**: `RevenueMetricsType`

```graphql
query {
  revenueMetrics {
    totalRevenue
    avgPaymentValue
    totalPayments
  }
}
```

---

### 3. `reservationMetrics`

**Descripción**: Métricas detalladas de reservaciones.

**Retorna**: `ReservationMetricsType`

```graphql
query {
  reservationMetrics {
    totalReservations
    cancelledReservations
    confirmedReservations
    completedReservations
    cancellationRate
  }
}
```

---

### 4. `reviewMetrics`

**Descripción**: Métricas de calificaciones y reseñas.

**Retorna**: `ReviewMetricsType`

```graphql
query {
  reviewMetrics {
    avgRating
    totalReviews
    fiveStarCount
    oneStarCount
  }
}
```

---

### 5. `dailyRevenue`

**Descripción**: Ingresos agrupados por día (formato YYYY-MM-DD).

**Retorna**: Array de `DailyRevenueType`

```graphql
query {
  dailyRevenue {
    date
    revenue
    paymentCount
  }
}
```

---

### 6. `topRestaurantsByRevenue`

**Descripción**: Restaurantes ordenados por ingresos totales (descendente).

**Retorna**: Array de `TopRestaurantType`

```graphql
query {
  topRestaurantsByRevenue {
    restaurantId
    totalRevenue
    paymentCount
  }
}
```

---

## ⚙️ Consideraciones Técnicas

- **Todos los llamados HTTP** se realizan desde `analytics.service.ts`
- **Todo el procesamiento lógico** (cálculos, agrupaciones, filtros) se hace en `analytics.resolver.ts`
- No se replica la lógica de `act_4_rest`; se consume como fuente de datos
- Se utilizan utilidades estándar de JS/TS: `.map()`, `.filter()`, `.reduce()`, `.sort()`
- Los datos de fecha se manejan como strings ISO y se procesan con `.split()` para agrupar por día

---

## 🚀 Cómo Ejecutar

1. **Asegurarse de que `act_4_rest` esté corriendo**:

   ```bash
   cd ../act_4_rest
   npm run start:dev
   ```

2. **Ejecutar el servidor GraphQL**:

   ```bash
   cd ../act_5_graphql
   npm run start:dev
   ```

3. **Abrir Apollo Sandbox** (recomendado desde 2025):
   - URL: `http://localhost:3001/graphql`
   - El playground deprecado fue reemplazado por **Apollo Sandbox**
   - Interfaz moderna con mejor experiencia de desarrollo
   - Probar las queries listadas arriba

---

## 📦 Versiones y Stack Tecnológico

### Versiones Actuales (Octubre 2025)

- **NestJS**: v11.1.0
- **@nestjs/graphql**: v13.2.0
- **@nestjs/apollo**: v13.2.1
- **Apollo Server**: v5.0.0
- **GraphQL**: v16.9.0

### Cambios Importantes desde 2024

- ❌ **Apollo Playground deprecado** (abril 2025)
- ✅ **Apollo Sandbox** como IDE recomendado
- ✅ `ApolloServerPluginLandingPageLocalDefault()` plugin para desarrollo local
- ✅ Code-first approach con decoradores TypeScript

---

## 🔧 Extensiones Futuras

- Agregar filtros por rango de fechas (ej: `dailyRevenue(startDate, endDate)`)
- Implementar comparaciones temporales (mes actual vs mes anterior)
- Calcular variaciones porcentuales
- Agregar métricas por restaurante específico
- Cachear resultados con TTL corto para mejorar performance
- Implementar DataLoader para optimizar queries N+1

---

## 📚 Referencias

- [NestJS GraphQL Docs](https://docs.nestjs.com/graphql/quick-start)
- [Apollo Server 5 Migration Guide](https://www.apollographql.com/docs/apollo-server/migration/)
- [Apollo Sandbox](https://www.apollographql.com/blog/announcement/platform/apollo-sandbox-an-open-graphql-ide-for-local-development/)

---

## 💡 Resumen

> **"Antes de calcular, observa. Tu primer paso siempre es leer y entender el módulo `act_4_rest`, ya que ahí está la fuente de datos que alimentarás en tus queries."**

Este módulo es un **layer de analytics** que transforma datos operacionales en insights de negocio mediante queries GraphQL optimizadas, usando las últimas versiones y mejores prácticas de NestJS + GraphQL (2025).
