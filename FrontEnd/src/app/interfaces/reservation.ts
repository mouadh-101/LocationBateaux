import { Boat } from "./boat";
import { User } from "./user";

export interface Reservation {
    reservationId: number;
    dateDebut : Date ;
    dateFin : Date ;
    nbPersonnes: number;
    status: string;
    utilisateur:User;
    bateau : Boat;
  }
  export interface ReservationAdd {
    dateDebut : Date ;
    dateFin : Date ;
    nbPersonnes: number;
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
  