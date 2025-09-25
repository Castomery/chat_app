import {create} from "zustand";
import { axiosInstance } from "../configs/axios";
import toast from "react-hot-toast";
import type { LoginData, SignUpData, User } from "../types/types";

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp:boolean;
  isLoggingIn:boolean;
  checkAuth: () => void;
  signup:(data:SignUpData) => void;
  login:(data: LoginData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    checkAuth: async ()=> {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({authUser: res.data});



        } catch (error) {
            console.log(error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth: false});
        }
    },
    signup: async(data)=>{
        set({isSigningUp:true})
        
        try {    
            const res = await axiosInstance.post("auth/signup", data);
            set({authUser: res.data});

            toast.success("Account created successfully!");

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },
    login: async(data)=>{
        set({isLoggingIn:true})
        
        try {    
            const res = await axiosInstance.post("auth/login", data);
            set({authUser: res.data});

            toast.success("Logged in successfully!");

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout: async() =>{
        try {    
            await axiosInstance.post("auth/logout");
            set({authUser: null});

            toast.success("Looged out!");

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
}))