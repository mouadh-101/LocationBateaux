export interface User {
    id: number,
    email: string,
    phone :string,
    password: string,
    name: string,
    role: string
}
export interface UserLogin {
    email: string,
    password: string
}

export interface JwtPayload {
    id:number;
    sub: string;
    role: string;
    exp: number;
  }
export interface UserStats {
    nbBateaux: number;
    nbReservations: number;
    nbReviews: number;
    nbFavorites: number;
}
export interface AuthenticationResponse {
    status: string;
    message: string;
    token?: string;
}