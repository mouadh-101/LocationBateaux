export interface Boat {
  bateauxId: number;
  nom: string;
  description: string;
  prix: number;
  images: { url: string }[];
  disponible: boolean;
  avis: Avis[];
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