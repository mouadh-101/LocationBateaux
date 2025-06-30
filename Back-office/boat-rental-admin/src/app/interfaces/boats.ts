import { Reservation } from "./reservation";
import { User } from "./user";

export interface Image {
  imageId?: number;
  url: string;
}
export interface Boat {
  bateauxId?: number;
  nom: string;
  description: string;
  prix: number;
  images: Image[];
  disponible?: boolean;
  avis?: any[];          // si tu ne les utilises pas, mets any[] ou un type plus précis plus tard
  reservations?: any[];
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
