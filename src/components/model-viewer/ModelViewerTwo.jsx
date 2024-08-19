import { IProduct, IVariant } from "@/types/products/product";
import { useCartState, useProductState } from "@/zustand/product";
import { useRef, useState, useEffect } from "react";
import ThreeD from "@/components/ThreeD/ThreeD";



interface PostMessageData {
    type: string;
    material: string,
    value: string;
}

export default function ModelViewerTwo() {
    const product: IProduct | null = useProductState(state => state.product);
    const variant = useProductState(state => state.variant);
    console.log(variant)
    console.log("model viewer")
    const ref = useRef<HTMLIFrameElement>(null);
    const [defaultVariant] = useState<IVariant | undefined>(
        product?.variants.items.find(({ id }) => id === product.variants.default)
    );
    console.log(defaultVariant)

    const baseColorOption = useCartState(state => state.options.find(a => a.id === "base-color"));
    const allOptions = useCartState(state => state.options);
    const colorOptions = product?.options.filter(({ type, id }) => type === "color-select" && id !== "base-color") ?? [];
    const selectedOptions = colorOptions.filter(opt => allOptions.some(b => b.id === opt.id));

    useEffect(() => {
        if (ref.current && baseColorOption) {
            const postMessageData: PostMessageData = {
                type: "base-color",
                material: "*",
                value: (baseColorOption?.value ?? "").toString()
            };
            ref.current.contentWindow?.postMessage(postMessageData, '*');
        }
        if (ref.current && selectedOptions) {
            for (const option of selectedOptions) {
                const postMessageData: PostMessageData = {
                    type: "material-color",
                    material: option.material,
                    value: (allOptions.find(({ id }) => id === option.id)?.value ?? "").toString()
                };
                console.log(postMessageData);
                ref.current.contentWindow?.postMessage(postMessageData, '*');
            }
        }
    }, [selectedOptions, baseColorOption, allOptions]);

    return (
        <>
           
                <ThreeD />
        </>
    );
}
