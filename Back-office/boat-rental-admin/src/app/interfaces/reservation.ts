import { Boat } from "./boats";
import { User } from "./user";

export interface Reservation {
  reservationId: number;
  date: Date;  // date de réservation (ex: "2025-07-16")
  typeReservation: 'FULL_DAY' | 'HALF_DAY' | 'TWO_HOURS';
  nbPersonnes: number;
  status: 'EN_ATTENTE' | 'ACCEPTER' | 'REFUSER';
  utilisateur: User;
  bateau: Boat;
  paiement?: any; // optionnel, peut être une interface à définir plus tard
}

export interface ReservationAdd {
  date: Date;
  typeReservation: 'FULL_DAY' | 'HALF_DAY' | 'TWO_HOURS';
  nbPersonnes: number;
  status?: 'EN_ATTENTE' | 'ACCEPTER' | 'REFUSER'; // optionnel à la création
}

export interface ReservationStatus {
  code: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  canCancel: boolean;
  canModify: boolean;
}
