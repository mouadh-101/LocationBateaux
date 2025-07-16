export interface ReservationAdd {
  date: Date;
  typeReservation: 'FULL_DAY' | 'HALF_DAY' | 'TWO_HOURS';
  nbPersonnes: number;
  status?: 'EN_ATTENTE' | 'ACCEPTER' | 'REFUSER';
}
