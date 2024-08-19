import { IProduct, IProductCartItem, IVariant } from "@/types/products/product";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import mozjexl from 'mozjexl';

export interface IUseProductState {
    product: IProduct | null,
    variant: IVariant | null,
    setVariant: (id: string) => void,
    setProduct: (product: IProduct) => void,
    price: number,
    evaluatePrice: () => any,
}
export const useProductState = create(devtools<IUseProductState>((set, get) => ({
    product: null, setProduct: (product: IProduct) => set({ product, variant: product.variants.items.find(({ id }) => id === product.variants.default) }),
    variant: null,
    setVariant: (id: string) => {
        set(({ product }) => ({ variant: product ? product.variants.items.find(({ id: _id }: { id: string }) => _id === id) : null }));
    },
    price: 0,
    evaluatePrice: async () => {
        const { product, variant } = get();
        if (!variant || !product) return;
        const selectedOptions = useCartState.getState().options;
        const options = product?.options.filter(({ id }) => selectedOptions.findIndex(({ id: _id }) => _id === id) === -1) ?? [];
        let base = product.price.value + parseFloat((await mozjexl.eval(variant.priceModifier, { product, variant }).catch(() => (-1))));
        for (const [index, option] of options.entries()) {
            base += await mozjexl.eval(option.option.priceModifier, { product, selection: { index } }).catch(() => (0))
        }
        console.log(base);
        set(variant ? ({
            price: base
        }) : {});
    },
})));

export interface IUseCartState {
    options: Array<{ id: string, value: string | number }>,
    // variant: { id: string, selected: boolean } | null,
    addOption: (id: string, value: string | number) => void,
    serialize: () => ({ configuration: IProductCartItem["configuration"] } | null)
};
export const useCartState = create(devtools<IUseCartState>((set, get) => ({
    options: [],
    // variant: null,
    // setVariant: (id: string) => set({ variant: { id: id, selected: true } }),
    addOption: (id: string, value: string | number) => {
        set(({ options }) => {
            // Check if an option with the same id exists
            const existingIndex = options.findIndex(option => option.id === id);
            if (existingIndex !== -1) {
                // If option with same id exists, update its value
                const updatedOptions = [...options];
                updatedOptions[existingIndex] = { id, value };
                return { options: updatedOptions };
            } else {
                // If option doesn't exist, add a new one
                return { options: [...options, { id, value }] };
            }
        });
    },
    serialize: () => {
        const variant = useProductState.getState().variant;
        if (variant !== null) return ({ configuration: { options: get().options, variant: { id: variant.id, selected: true } } })
        return null;
    }
})));
export interface IUseSearchState {
    query: string,
    setQuery: (q: string) => void,
    open: boolean, toggleOpen: () => void,
};
export const useSearchState = create(devtools<IUseSearchState>((set, get) => ({
    query: "", setQuery: (q: string) => set({ query: q }), open: false, toggleOpen: () => set(({ open }) => ({ open: !open }))
})));