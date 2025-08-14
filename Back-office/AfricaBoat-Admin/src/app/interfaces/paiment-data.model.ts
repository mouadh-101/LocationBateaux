import { Reservation } from "./reservation";

export interface PaiementData {
  id: number;
  montant: number;
  datePaiement: string; // ISO date
  status: 'ACCEPTER' | 'REFUSER' | 'EN_ATTENTE';
  methode: 'CLICKTOPAY' | 'PAYPAL';
  reservation: Reservation;

  user?: {
    id: number;
    name: string;  // **nom => name**
    email: string;
  };

  bateau?: {
    id: number;
    nom: string;
  };
}
