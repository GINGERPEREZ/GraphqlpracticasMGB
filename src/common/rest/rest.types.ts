export interface RestUser {
  id: string;
  email: string;
  names: string;
  phone: string;
}

export interface RestReservation {
  id: string;
  userId: string;
  restaurantId: string;
  tableId: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  status: string;
  notes?: string | null;
}

export interface RestPayment {
  id: string;
  reservationId: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  paidAt: string;
  reference?: string | null;
  notes?: string | null;
}

export interface RestRestaurant {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  openingHours?: string | null;
  capacity: number;
  imageId?: string | null;
  imageUrl?: string | null;
}

export interface RestMenu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  price?: number | null;
  coverImageUrl?: string | null;
}

export interface RestDish {
  id: string;
  restaurantId: string;
  menuId: string;
  name: string;
  description?: string | null;
  price: number;
  imageId?: string | null;
  imageUrl?: string | null;
}

export interface RestReview {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}
