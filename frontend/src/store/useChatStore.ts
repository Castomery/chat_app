import {create} from 'zustand';
import { axiosInstance } from '../configs/axios';
import toast from 'react-hot-toast';
import type { User } from '../types/types';
import { useAuthStore } from './useAuthStore';

interface ChatStoreState {
    allContacts: Array<User>,
    chats: Array<User>,
    messages: Array<object>,
    activeTab: string,
    selectedUser: User | null,
    isUserLoading: boolean,
    isMessagesLoading: boolean,
    isSoundEnabled: boolean,
    toggleSound: () => void,
    setActiveTab: (tab:string) => void,
    setSelectedUser: (selectedUser:User|null) => void,
    getAllContacts: () => void,
    getMyChatPartners: () => void,
    getMessagesByUserId: (userId:string)=> void,
    sendMessage: (messageData:{text:string, image:string|null}) => void,
}

export const useChatStore = create<ChatStoreState>((set,get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: (localStorage.getItem("isSoundEnabled") === "true"),
    toggleSound: () => {
        const newValue = !get().isSoundEnabled
        localStorage.setItem("isSoundEnabled", String(newValue))
        set({isSoundEnabled: newValue})
    },

    setActiveTab: (tab) => set({activeTab: tab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),

    getAllContacts: async() => {
        set({isUserLoading: true})
        try {
            const res = await axiosInstance.get('/messages/contacts');
            set({allContacts: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },
    getMyChatPartners: async() => {
        set({isUserLoading: true})
        try {
            const res = await axiosInstance.get('/messages/chats');
            set({chats: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },

    getMessagesByUserId: async(userId) =>{
        set({isMessagesLoading:true})

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async(messageData) => {

        const {selectedUser, messages} = get()
        const {authUser} = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser?._id,
            recieverId: selectedUser?._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic:true,
        };

        set({messages: [...messages, optimisticMessage]});

        console.log(messageData);

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`,messageData)
            set({messages: messages.concat(res.data)})
        } catch (error) {
            set({messages: messages})
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
}))