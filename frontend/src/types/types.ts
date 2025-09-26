export interface User {
  _id: string;
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

export interface Message {
  _id: string;
  senderId: string;
  recieverId:string;
  text?: string;
  image: string | null;
  createdAt: string;
}

export type OptimisticMessage = Message & {isOptimistic: true};