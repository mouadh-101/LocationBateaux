import { Boat } from "./boat";
import { User } from "./user";

export interface Reservation {
    reservationId: number;
    date : Date ;
    typeReservation:string;
    nbPersonnes: number;
    status: string;
    utilisateur:User;
    bateau : Boat;
  }
  export interface ReservationAdd {
    date : Date ;
    typeReservation:string;
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
  export interface ReservationTypeSettings{
    id:number;
    full_day_enabled:boolean;
    half_day_enabled:boolean;
    two_hours_enabled:boolean;
    fullDayPrice: number;
    halfDayPrice: number;
    twoHoursPrice: number;
}
  