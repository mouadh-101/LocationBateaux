import { Reservation } from "./reservation";

export interface Paiment {
    paiementId: number ;
    montant: number ;
    datePaiement: Date ;
    methode :string ;
    status :string;
    reservation:Reservation;
}
