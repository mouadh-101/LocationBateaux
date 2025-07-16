import { Reservation } from "./reservation";
import { User } from "./user";

export interface Image {
  imageId?: number;
  url: string;
}

export interface Caracteristique {
  capacite: number;
  longueur: number;
  largeur: number;
  nombreMoteurs: number;
  type: string; // ou enum TypeBateaux
}

export interface ReservationTypeSettings {
  full_day_enabled: boolean;
  half_day_enabled: boolean;
  two_hours_enabled: boolean;
}

export interface Boat {
  bateauxId?: number;
  nom: string;
  description: string;
  prix: number;
  port: {
  nom:string
  };
  carecteristique: Caracteristique;
  images: Image[];
  disponible?: boolean;
  commission:number
  avis?: any[];          // si tu ne les utilises pas, mets any[] ou un type plus précis plus tard
  reservations?: any[];
  reservationTypeSettings: ReservationTypeSettings;
}
export interface Avis {
  avisId: number;
  note: number;
  commentaire: string;
  dateCreation: Date;
  utilisateur: {
    id: number;
    name: string;
  };
}

export interface Service {
  id: number;
  titre: string;
  description: string;
  icone: string;
}

export interface Partner {
  id: number;
  logo: string;
}

export interface Benefit {
  id: number;
  titre: string;
  description: string;
  icone: string;
}
