export interface User {
  id: object;
  fullName: string;
  email: string;
  profilePic:string,
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