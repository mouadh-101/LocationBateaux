export interface User {
    id: number,
    email: string,
    password: string,
    name: string,
    role: string
}
export interface UserLogin {
    email: string,
    password: string
}
export interface UserRegister {
    name: string,
    email: string,
    password: string,
    role: string
}
export interface JwtPayload {
    sub: string;  
    role: string; 
    exp: number;
  }
