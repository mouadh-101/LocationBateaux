import { Boat } from './boats';  // ou './boat' si c’est ton nom de fichier
import { User } from './user';

export interface ReservationData {
  reservationId: number;
  date: Date;
  typeReservation: 'FULL_DAY' | 'HALF_DAY' | 'TWO_HOURS';
  nbPersonnes: number;
  status: 'EN_ATTENTE' | 'ACCEPTER' | 'REFUSER';
  utilisateur: User;
  bateau: Boat;
  paiement: any; // tu peux ajouter une interface Paiement plus tard si nécessaire
}
