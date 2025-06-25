export interface Boat {
    bateauxId: number;
    nom: string;
    description: string;
    prix: number;
    images: { url: string }[];
    disponible: boolean;
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