import { Injectable, NotFoundException } from '@nestjs/common';

import { RestClientService } from '../../common/rest/rest-client.service.js';
import type {
  RestDish,
  RestMenu,
  RestPayment,
  RestReservation,
  RestRestaurant,
  RestReview,
  RestUser,
} from '../../common/rest/rest.types.js';
import { PerfilUsuarioType } from '../types/perfil-usuario.type.js';
import { ProductoDetalladoType } from '../types/producto-detallado.type.js';
import { ResumenGeneralType } from '../types/resumen-general.type.js';
import type { DishType } from '../../types/dish.type.js';
import type { MenuType } from '../../types/menu.type.js';
import type { PaymentSummaryType } from '../../types/payment.type.js';
import type { ReservationSummaryType } from '../../types/reservation.type.js';
import type { RestaurantType } from '../../types/restaurant.type.js';
import type { ReviewType } from '../../types/review.type.js';
import type { UserType } from '../../types/user.type.js';

@Injectable()
export class AgregacionService {
  constructor(private readonly restClient: RestClientService) {}

  async obtenerPerfilUsuario(id: string): Promise<PerfilUsuarioType> {
    const usuario = await this.restClient.getOne<RestUser>(`/users/${id}`);

    const reservas =
      await this.restClient.getAllPaginated<RestReservation>('/reservations');

    const pagos =
      await this.restClient.getAllPaginated<RestPayment>('/payments');

    const reservasFiltradas = reservas
      .filter((reserva) => reserva.userId === id)
      .sort((a, b) =>
        this.compareDatesDesc(a.reservationDate, b.reservationDate),
      )
      .slice(0, 3)
      .map((reserva) => this.mapReservation(reserva));

    const pagosFiltrados = pagos
      .filter((pago) => pago.userId === id)
      .sort((a, b) => this.compareDatesDesc(a.paidAt, b.paidAt))
      .slice(0, 3)
      .map((pago) => this.mapPayment(pago));

    const gastoTotal = pagos
      .filter((pago) => pago.userId === id)
      .reduce((total, pago) => total + pago.amount, 0);

    return {
      usuario: this.mapUser(usuario),
      ultimasReservas: reservasFiltradas,
      ultimosPagos: pagosFiltrados,
      gastoTotal,
    } as PerfilUsuarioType;
  }

  async obtenerProductoDetallado(id: string): Promise<ProductoDetalladoType> {
    const plato = await this.restClient.getOne<RestDish>(`/dishes/${id}`);
    const menu = await this.restClient.getOne<RestMenu>(
      `/menus/${plato.menuId}`,
    );
    const restaurante = await this.restClient.getOne<RestRestaurant>(
      `/restaurants/${plato.restaurantId}`,
    );

    const resenas =
      await this.restClient.getAllPaginated<RestReview>('/reviews');

    const resenasRecientes = resenas
      .filter((resena) => resena.restaurantId === restaurante.id)
      .sort((a, b) => this.compareDatesDesc(a.createdAt, b.createdAt))
      .slice(0, 5)
      .map((resena) => this.mapReview(resena));

    return {
      plato: this.mapDish(plato),
      menu: this.mapMenu(menu),
      restaurante: this.mapRestaurant(restaurante),
      ultimasResenas: resenasRecientes,
    } as ProductoDetalladoType;
  }

  async obtenerResumenGeneral(): Promise<ResumenGeneralType> {
    const [usuarios, platos, pagos] = await Promise.all([
      this.restClient.getAllPaginated<RestUser>('/users'),
      this.restClient.getAllPaginated<RestDish>('/dishes'),
      this.restClient.getAllPaginated<RestPayment>('/payments'),
    ]);

    const hoy = new Date();

    const totalVentasHoy = pagos
      .filter((pago) => this.isSameDay(pago.paidAt, hoy))
      .reduce((total, pago) => total + pago.amount, 0);

    return {
      totalClientes: usuarios.length,
      totalPlatos: platos.length,
      totalVentasHoy,
    } as ResumenGeneralType;
  }

  private compareDatesDesc(a: string, b: string): number {
    return new Date(b).getTime() - new Date(a).getTime();
  }

  private isSameDay(value: string, reference: Date): boolean {
    const target = new Date(value);
    return (
      target.getUTCFullYear() === reference.getUTCFullYear() &&
      target.getUTCMonth() === reference.getUTCMonth() &&
      target.getUTCDate() === reference.getUTCDate()
    );
  }

  private mapUser(usuario: RestUser): UserType {
    return { ...usuario } as UserType;
  }

  private mapReservation(reserva: RestReservation): ReservationSummaryType {
    return {
      ...reserva,
      reservationDate: new Date(reserva.reservationDate),
    } as ReservationSummaryType;
  }

  private mapPayment(pago: RestPayment): PaymentSummaryType {
    return {
      ...pago,
      paidAt: new Date(pago.paidAt),
    } as PaymentSummaryType;
  }

  private mapDish(plato: RestDish): DishType {
    return { ...plato } as DishType;
  }

  private mapMenu(menu: RestMenu): MenuType {
    return { ...menu } as MenuType;
  }

  private mapRestaurant(restaurante: RestRestaurant): RestaurantType {
    return { ...restaurante } as RestaurantType;
  }

  private mapReview(resena: RestReview): ReviewType {
    return {
      ...resena,
      createdAt: new Date(resena.createdAt),
    } as ReviewType;
  }

  async obtenerRestaurantePorId(id: string): Promise<RestaurantType | null> {
    try {
      const restaurante = await this.restClient.getOne<RestRestaurant>(
        `/restaurants/${id}`,
      );
      return this.mapRestaurant(restaurante);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  async obtenerReservacionPorId(
    id: string,
  ): Promise<ReservationSummaryType | null> {
    try {
      const reserva = await this.restClient.getOne<RestReservation>(
        `/reservations/${id}`,
      );
      return this.mapReservation(reserva);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }
}
