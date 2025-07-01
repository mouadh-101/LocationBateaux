import { Boat } from './boat';

export interface Port {
    portId: number;
    nom: String;
    bateaux: Boat[];
}
export interface PortAdd{
    portId: number;
    nom: String;
}
