import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { BusquedaService } from '../services/busqueda.service.js';
import { PaginationInput } from '../../inputs/pagination.input.js';
import { FiltroProductoInput } from '../../inputs/filtro-producto.input.js';
import { FiltroHistorialInput } from '../../inputs/filtro-historial.input.js';
import { PaginatedProductsType } from '../../types/paginated-products.type.js';
import { ProductResultType } from '../../types/product-result.type.js';
import { PurchaseType } from '../../types/purchase.type.js';
import { UserType } from '../../types/user.type.js';
import { MenuType } from '../../types/menu.type.js';
import { RestaurantType } from '../../types/restaurant.type.js';
import { ReservationSummaryType } from '../../types/reservation.type.js';

@Resolver(() => ProductResultType)
export class BusquedaResolver {
  constructor(private readonly busquedaService: BusquedaService) {}

  @Query(() => PaginatedProductsType, {
    name: 'buscarProductos',
    description: 'Busqueda avanzada de productos con paginacion y filtros.',
  })
  async buscarProductos(
    @Args('filtro', { nullable: true }) filtro?: FiltroProductoInput,
    @Args('paginacion', { nullable: true }) paginacion?: PaginationInput,
  ): Promise<PaginatedProductsType> {
    const items = await this.busquedaService.findAllDishes();
    const menus = await this.busquedaService.findAllMenus();
    const menuMap = new Map<string, any>();
    menus.forEach((menu: any) => menuMap.set(String(menu.id), menu));

    let filteredMenusTargetId: string | null = null;
    if (filtro?.menuName) {
      const menuMatch = menus.find(
        (m: any) => String(m.name).toLowerCase() === String(filtro.menuName).toLowerCase(),
      );
      if (!menuMatch) {
        return {
          items: [],
          total: 0,
          pages: 1,
        };
      }
      filteredMenusTargetId = String(menuMatch.id);
    }

    // Filtrado
    let filtered = items.filter((p: any) => {
      if (filtro?.nombre && !p.name.toLowerCase().includes(filtro.nombre.toLowerCase())) return false;
      if (filtro?.precioMin != null && p.price < filtro.precioMin) return false;
      if (filtro?.precioMax != null && p.price > filtro.precioMax) return false;
      if (filtro?.restaurantId && String(p.restaurantId) !== String(filtro.restaurantId)) return false;
      if (filtro?.menuId && String(p.menuId) !== String(filtro.menuId)) return false;
      if (filteredMenusTargetId && String(p.menuId) !== filteredMenusTargetId) return false;
      return true;
    });

    const total = filtered.length;
    const limit = paginacion?.limit ?? 10;
    const offset = paginacion?.offset ?? 0;
    const paged = filtered.slice(offset, offset + limit).map((p: any) => {
      const menu = menuMap.get(String(p.menuId));
      const menuId = p.menuId ? String(p.menuId) : null;
      const restaurantId = p.restaurantId
        ? String(p.restaurantId)
        : menu?.restaurantId
        ? String(menu.restaurantId)
        : null;
      const menuCache = menu
        ? {
            id: String(menu.id),
            restaurantId: String(menu.restaurantId),
            name: menu.name,
            description: menu.description ?? null,
            price: menu.price != null ? Number(menu.price) : null,
            coverImageUrl: menu.coverImageUrl ?? null,
          }
        : null;
      return {
        id: String(p.id),
        name: p.name,
        price: Number(p.price),
        stock: Number(p.stock ?? 0),
        menuId,
        menuName: menuCache ? menuCache.name : null,
        restaurantId,
        menuCache,
      };
    });

    return {
      items: paged as ProductResultType[],
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  @Query(() => [UserType], {
    name: 'buscarClientes',
    description: 'Buscar clientes por nombre o email y ordenarlos por campo dado.',
  })
  async buscarClientes(
    @Args('criterio', { type: () => String, nullable: true }) criterio?: string,
    @Args('orden', { type: () => String, nullable: true }) orden?: string,
  ): Promise<UserType[]> {
    const clientes = await this.busquedaService.findAllUsers();

    let filtered = clientes;
    if (criterio) {
      const lower = criterio.toLowerCase();
      filtered = clientes.filter((c: any) => {
        return (
          String(c.names ?? '').toLowerCase().includes(lower) || String(c.email ?? '').toLowerCase().includes(lower)
        );
      });
    }

    if (orden === 'nombre') {
      filtered = filtered.sort((a: any, b: any) => String(a.names ?? '').localeCompare(String(b.names ?? '')));
    } else if (orden === 'fechaRegistro' || orden === 'fecha') {
      filtered = filtered.sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    }

    return filtered.map((c: any) => ({ id: String(c.id), email: c.email, names: c.names, phone: c.phone }));
  }

  @Query(() => [PurchaseType], {
    name: 'historialComprasCliente',
    description: 'Historial de compras de un cliente filtrado por fecha y total.',
  })
  async historialComprasCliente(
    @Args('clienteId', { type: () => ID }) clienteId: string,
    @Args('filtro', { nullable: true }) filtro?: FiltroHistorialInput,
  ): Promise<PurchaseType[]> {
    const ventas = await this.busquedaService.findAllPayments();
    const clienteIdStr = String(clienteId);
    let filtered = ventas.filter((v: any) => String(v.userId) === clienteIdStr);

    if (filtro?.fechaDesde) {
      filtered = filtered.filter((v: any) => new Date(v.paidAt) >= new Date(filtro.fechaDesde as any));
    }
    if (filtro?.fechaHasta) {
      filtered = filtered.filter((v: any) => new Date(v.paidAt) <= new Date(filtro.fechaHasta as any));
    }
    if (filtro?.totalMin != null) {
      filtered = filtered.filter((v: any) => Number(v.amount) >= filtro.totalMin!);
    }
    if (filtro?.totalMax != null) {
      filtered = filtered.filter((v: any) => Number(v.amount) <= filtro.totalMax!);
    }

    // Map to PurchaseType shape
    return filtered.map((v: any) => ({
      id: String(v.id),
      reservationId: String(v.reservationId),
      userId: String(v.userId),
      amount: Number(v.amount),
      currency: v.currency ?? 'USD',
      paidAt: new Date(v.paidAt),
    }));
  }

  @ResolveField(() => MenuType, {
    nullable: true,
    description: 'Resuelve el menu asociado al plato cuando se solicita en la query.',
  })
  async menu(@Parent() producto: ProductResultType): Promise<MenuType | null> {
    if (producto.menuCache) {
      return producto.menuCache;
    }
    if (!producto.menuId) {
      return null;
    }
    const data = await this.busquedaService.findMenuById(producto.menuId);
    if (!data) {
      return null;
    }
    const result: MenuType = {
      id: String(data.id),
      restaurantId: String(data.restaurantId),
      name: data.name,
      description: data.description ?? null,
      price: data.price != null ? Number(data.price) : null,
      coverImageUrl: data.coverImageUrl ?? null,
    };
    producto.menuCache = result;
    if (!producto.restaurantId) {
      producto.restaurantId = result.restaurantId;
    }
    return result;
  }

  @ResolveField(() => RestaurantType, {
    nullable: true,
    description: 'Resuelve el restaurante asociado al plato.',
  })
  async restaurant(@Parent() producto: ProductResultType): Promise<RestaurantType | null> {
    if (producto.restaurantCache) {
      return producto.restaurantCache;
    }
    const restaurantId = producto.restaurantId ?? producto.menuCache?.restaurantId ?? null;
    if (!restaurantId) {
      return null;
    }
    const data = await this.busquedaService.findRestaurantById(restaurantId);
    if (!data) {
      return null;
    }
    const result: RestaurantType = {
      id: String(data.id),
      name: data.name ?? 'Restaurante',
      description: data.description ?? null,
      address: data.address ?? 'No disponible',
      openingHours: data.openingHours ?? null,
      capacity: data.capacity != null ? Number(data.capacity) : 0,
      imageId: data.imageId ?? null,
      imageUrl: data.imageUrl ?? null,
    };
    producto.restaurantCache = result;
    return result;
  }
}

@Resolver(() => PurchaseType)
export class BusquedaPurchaseResolver {
  constructor(private readonly busquedaService: BusquedaService) {}

  @ResolveField(() => ReservationSummaryType, {
    nullable: true,
    description: 'Resuelve la reservacion enlazada a un pago cuando se solicita.',
  })
  async reservation(@Parent() pago: PurchaseType): Promise<ReservationSummaryType | null> {
    if (pago.reservationCache) {
      return pago.reservationCache;
    }
    if (!pago.reservationId) {
      return null;
    }
    const data = await this.busquedaService.findReservationById(pago.reservationId);
    if (!data) {
      return null;
    }
    const result: ReservationSummaryType = {
      id: String(data.id),
      userId: String(data.userId),
      restaurantId: String(data.restaurantId),
      tableId: String(data.tableId),
      reservationDate: new Date(data.reservationDate ?? Date.now()),
      reservationTime: data.reservationTime ?? '',
      guestCount: Number(data.guestCount ?? 0),
      status: data.status ?? 'unknown',
      notes: data.notes ?? null,
      restaurant: null,
    };
    pago.reservationCache = result;
    return result;
  }

  @ResolveField(() => UserType, {
    nullable: true,
    description: 'Resuelve el usuario que realizo el pago.',
  })
  async user(@Parent() pago: PurchaseType): Promise<UserType | null> {
    if (pago.userCache) {
      return pago.userCache;
    }
    if (!pago.userId) {
      return null;
    }
    const data = await this.busquedaService.findUserById(pago.userId);
    if (!data) {
      return null;
    }
    const result: UserType = {
      id: String(data.id),
      email: data.email ?? '',
      names: data.names ?? '',
      phone: data.phone ?? '',
    };
    pago.userCache = result;
    return result;
  }
}
