export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignUpData{
    fullName:string;
    email:string;
    password:string;
}

export interface LoginData{
    email:string;
    password:string;
}