import { create } from "zustand";

export interface IUsePageState {
    cartOpen: boolean, toggleCartOpen: (t?: boolean) => void,
}
export const usePageState = create<IUsePageState>((set, get) => ({
    cartOpen: false, toggleCartOpen: (t) => set(state => ({ cartOpen: t ?? !state.cartOpen }))
}));


export interface IUseProductEditorDialogState {
    open: boolean, toggleOpen: (t?: boolean) => void,
}
export const useProductEditorDialogState = create<IUseProductEditorDialogState>((set, get) => ({
    open: false,
    toggleOpen: (o?: boolean) => set(state => ({ open: o ?? !state.open })),
}))

export interface IUseProductEditorState {
    data: object | null, onDataChange: (newData: object) => void,
}
export const useProductEditorState = create<IUseProductEditorState>((set, get) => ({
    data: null,
    onDataChange: (newData: object | null) => set({ data: newData }),
}))

//-
export interface IUseProductViewDialogState {
    open: boolean, toggleOpen: (t?: boolean) => void,
}
export const useProductViewDialogState = create<IUseProductViewDialogState>((set, get) => ({
    open: false,
    toggleOpen: (o?: boolean) => set(state => ({ open: o ?? !state.open })),
}));

export interface IUseProductViewState {
    data: object | null, onDataChange: (newData: object) => void,
}
export const useProductViewState = create<IUseProductViewState>((set, get) => ({
    data: null,
    onDataChange: (newData: object | null) => set({ data: newData }),
}));


//-
export interface IUseUserCreatorDialog {
    open: boolean, toggleOpen: (t?: boolean) => void,
}
export const useUserCreatorDialog = create<IUseUserCreatorDialog>((set, get) => ({
    open: false,
    toggleOpen: (o?: boolean) => set(state => ({ open: o ?? !state.open })),
}));

export interface IUseUserCreatorState {
    data: object | null, onDataChange: (newData: object) => void,
}
export const useUserCreatorState = create<IUseUserCreatorState>((set, get) => ({
    data: null,
    onDataChange: (newData: object | null) => set({ data: newData }),
}));

// export interface IUseAdminPageState {
//     cartOpen: boolean, toggleCartOpen: (t?: boolean) => void,
// }
// export const usePageState = create<IUsePageState>((set, get) => ({
//     cartOpen: false, toggleCartOpen: (t) => set(state => ({cartOpen: t ?? !state.cartOpen}))
// }));