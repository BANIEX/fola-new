import { IProduct, IVariant } from "@/types/products/product";
import { useCartState, useProductState } from "@/zustand/product";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import ThreeD from "@/components/ThreeD/ThreeD";


const ThreeD = dynamic(() => import("@/components/ThreeD/ThreeD"), {
  ssr: false,
});




interface PostMessageData {
    type: string;
    material: string,
    value: string;
}

export default function ModelViewerOriginal() {
  const product: IProduct | null = useProductState((state) => state.product);
  const variant = useProductState((state) => state.variant);
  const slug = useProductState((state)=> state.product?.slug)
  console.log("model viewer");
  const ref = useRef<HTMLIFrameElement>(null);
  const [defaultVariant] = useState<IVariant | undefined>(
    product?.variants.items.find(({ id }) => id === product.variants.default)
  );
  // console.log(defaultVariant)
  console.log("product", product);
//   let slug = product?.slug;

//   function isLastCharNumber(str: any) {
//     const lastChar = str.charAt(str.length - 1);
//     return !isNaN(Number(lastChar));
//   }

//   console.log(isLastCharNumber(slug));

  const baseColorOption = useCartState((state) =>
    state.options.find((a) => a.id === "base-color")
  );
  const allOptions = useCartState((state) => state.options);
  const colorOptions =
    product?.options.filter(
      ({ type, id }) => type === "color-select" && id !== "base-color"
    ) ?? [];
  const selectedOptions = colorOptions.filter((opt) =>
    allOptions.some((b) => b.id === opt.id)
  );

  useEffect(() => {
    if (ref.current && baseColorOption) {
      const postMessageData: PostMessageData = {
        type: "base-color",
        material: "*",
        value: (baseColorOption?.value ?? "").toString(),
      };
      ref.current.contentWindow?.postMessage(postMessageData, "*");
    }
    if (ref.current && selectedOptions) {
      for (const option of selectedOptions) {
        const postMessageData: PostMessageData = {
          type: "material-color",
          material: option.material,
          value: (
            allOptions.find(({ id }) => id === option.id)?.value ?? ""
          ).toString(),
        };
        console.log(postMessageData);
        ref.current.contentWindow?.postMessage(postMessageData, "*");
      }
    }
  }, [selectedOptions, baseColorOption, allOptions, slug]);


  function isLastCharNumber(str: any) {
    const lastChar = str.charAt(str.length - 1);
    return !isNaN(Number(lastChar));
  }

  return (
    <>
      {/* {isLastCharNumber(slug) ? <div>Hello</div> : <div>No way</div>} */}
      {slug ? (
        isLastCharNumber(slug) ? (
          <ThreeD product={product} />
        ) : (
          <iframe
            ref={ref}
            src={`https://docs.cloud.kabeers.network/tests/work/3d-ecom/index.php?model-uri=${
              (variant ?? defaultVariant)?.model?.src
            }&posters=${(variant ?? defaultVariant)?.images
              .map((a) => a.src)
              ?.join(",")}`}
            frameBorder={0}
            loading="eager"
            className="rounded-lg w-full h-full sm:px-0 max-w-7xl mx-2 mx-auto"
          />
        )
      ) : (
        <div>Loading...</div>
      )}

     
    </>
  );
}
