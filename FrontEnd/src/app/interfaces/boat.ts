import { Port } from "./port";
import { Reservation,ReservationTypeSettings } from "./reservation";
import { User } from "./user";

export interface Boat {
  bateauxId: number;
  nom: string;
  description: string;
  prix: number;
  images: { url: string }[];
  disponible: boolean;
  commission:number;
  avis: Avis[];
  reservations: Reservation[];
  port:Port;
  carecteristique: Caracteristique;
  reservationTypeSettings:ReservationTypeSettings
  services: ServiceBoat[];
  

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
export interface ServiceBoat {
  idService: number;
  nom: string;
}



export interface Benefit {
  id: number;
  titre: string;
  description: string;
  icone: string;
}
export interface Caracteristique {
  idCarecteristique: number;
  capacite: number;
  longueur: number;
  largeur: number;
  nombreMoteurs: number;
  type: string;
}
export interface BoatFilter {
  port:string;
  date:Date;
  nbPersonnes:number ;
}

