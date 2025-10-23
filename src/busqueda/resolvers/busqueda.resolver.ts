import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { BusquedaService } from '../services/busqueda.service.js';
import { PaginationInput } from '../../inputs/pagination.input.js';
import { FiltroProductoInput } from '../../inputs/filtro-producto.input.js';
import { FiltroHistorialInput } from '../../inputs/filtro-historial.input.js';
import { PaginatedProductsType } from '../../types/paginated-products.type.js';
import { ProductResultType } from '../../types/product-result.type.js';
import { PurchaseType } from '../../types/purchase.type.js';
import { UserType } from '../../types/user.type.js';

@Resolver()
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
    // load menus if menuName filter is provided or to enrich results
    const menus = await this.busquedaService.findAllMenus();

    // Filtrado
    let filtered = items.filter((p: any) => {
      if (filtro?.nombre && !p.name.toLowerCase().includes(filtro.nombre.toLowerCase())) return false;
      if (filtro?.precioMin != null && p.price < filtro.precioMin) return false;
      if (filtro?.precioMax != null && p.price > filtro.precioMax) return false;
      if (filtro?.restaurantId && String(p.restaurantId) !== String(filtro.restaurantId)) return false;
      if (filtro?.menuId && String(p.menuId) !== String(filtro.menuId)) return false;
      if (filtro?.menuName) {
        const found = menus.find((m: any) => String(m.name).toLowerCase() === String(filtro.menuName).toLowerCase());
        if (!found) return false;
        if (String(p.menuId) !== String(found.id)) return false;
      }
      return true;
    });

    const total = filtered.length;
    const limit = paginacion?.limit ?? 10;
    const offset = paginacion?.offset ?? 0;
    const paged = filtered.slice(offset, offset + limit).map((p: any) => {
      const menu = menus.find((m: any) => String(m.id) === String(p.menuId));
      return {
        id: String(p.id),
        name: p.name,
        price: Number(p.price),
        stock: Number(p.stock ?? 0),
        categoryId: p.menuId ? String(p.menuId) : null,
        menuName: menu ? String(menu.name) : null,
        restaurantId: p.restaurantId ? String(p.restaurantId) : null,
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
    @Args('clienteId', { type: () => Int }) clienteId: number,
    @Args('filtro', { nullable: true }) filtro?: FiltroHistorialInput,
  ): Promise<PurchaseType[]> {
  const ventas = await this.busquedaService.findAllPayments();
  let filtered = ventas.filter((v: any) => Number(v.userId) === Number(clienteId));

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
  return filtered.map((v: any) => ({ id: String(v.id), reservationId: String(v.reservationId), userId: String(v.userId), amount: Number(v.amount), currency: v.currency ?? 'USD', paidAt: new Date(v.paidAt) }));
  }
}
