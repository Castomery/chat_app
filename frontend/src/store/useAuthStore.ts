import { create } from "zustand";
import { axiosInstance } from "../configs/axios";
import toast from "react-hot-toast";
import type { LoginData, SignUpData, User } from "../types/types";
import axios from "axios";
import { io, type Socket } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  checkAuth: () => void;
  signup: (data: SignUpData) => void;
  login: (data: LoginData) => void;
  logout: () => void;
  updateProfile: (data: object) => void;
  socket: null| Socket;
  onlineUsers: Array<string>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Something went wrong");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Something went wrong");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });

      toast.success("Looged out!");
      get().disconnectSocket();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  },
  connectSocket: () => {
    const {authUser} = get();

    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true
    })

    socket.connect();
    set({socket: socket})

    socket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers: userIds})
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected)
      get().socket?.disconnect();
  },
}));
