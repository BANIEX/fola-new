import { IUser } from "@/types/auth/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
export const useAccountState = create(devtools<{setError: (error: {status: boolean, message: string}) => void, error: {status: boolean, message: string}, account: IUser | null, setAccount: (account: IUser) => void }>((set, get) => ({
    account: null,
    error: {
        status: false,
        message: ""
    },
    setError: (error: {status: boolean, message: string}) => set({error}),
    // @ts-ignore
    // setTitle: (title: string) => set((state) => ({account: {...state.account, crossroad: {...state.account.crossroad, theme: {...state.account?.crossroad.theme, title}}}, mutatedProfile: true})),
    // @ts-ignore
    // setDescription: (description: string) => set((state) => ({account: {...state.account, crossroad: {...state.account.crossroad, theme: {...state.account?.crossroad.theme, description}}}, mutatedProfile: true})),
    // @ts-ignore
    // setProfileImage: (source: string) => set((state) => ({account: {...state.account, profile: {...state.account?.profile, photo: source}}, mutatedProfile: true})),
    setAccount: (account: IUser) => set({ account }),
})));