import {create} from 'zustand';
import { axiosInstance } from '../configs/axios';
import toast from 'react-hot-toast';

interface ChatStoreState {
    allContacts: Array<object>,
    chats: Array<object>,
    messages: Array<object>,
    activeTab: string,
    selectedUser: object | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean,
    isSoundEnabled: boolean,
    toggleSound: () => void,
    setActiveTab: (tab:string) => void,
    setSelectedUser: (selectedUser:object) => void,
}

export const useChatStore = create<ChatStoreState>((set,get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: (localStorage.getItem("isSoundEnabled") === "true"),
    toggleSound: () => {
        const newValue = !get().isSoundEnabled
        localStorage.setItem("isSoundEnabled", String(newValue))
        set({isSoundEnabled: newValue})
    },

    setActiveTab: (tab) => set({activeTab: tab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),

    getAllContancts: async() => {
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get('/messages/contacts');
            set({allContacts: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMyChatPartners: async() => {
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get('/messages/chats');
            set({chats: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    }
}))