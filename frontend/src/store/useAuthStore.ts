import {create} from "zustand";
import { axiosInstance } from "../configs/axios";
import toast from "react-hot-toast";
import type { SignUpData, User } from "../types/types";

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp:boolean;
  checkAuth: () => void;
  signup:(data:SignUpData) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
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
    signup: async(data:SignUpData)=>{
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
    }
}))