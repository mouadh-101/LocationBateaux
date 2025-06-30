import { Boat } from "./boats";
import { User } from "./user";

export interface Reservation {
    reservationId: number;
    dateDebut : Date ;
    dateFin : Date ;
    status: string;
    utilisateur:User;
    bateau : Boat;
  }
  export interface ReservationAdd {
    dateDebut : Date ;
    dateFin : Date ;
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
