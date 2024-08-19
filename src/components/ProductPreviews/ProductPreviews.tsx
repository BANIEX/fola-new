import React, { useMemo } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types/products/product';

interface ProductPreviewsProps {
  products: Array<IProduct>;
  heading?: string;
  gridClasses?: string;
};

const ProductItem = React.memo(({ product }: { product: IProduct }) => {
  const defaultVariant = product.variants.items.find(({ id }) => id === product.variants.default);

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={defaultVariant?.images[0].src}
          alt={"Product Image"}
          className="h-full w-auto outline- mx-auto outline-black- object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className=" mt-4 flex flex-col  justify-between">
        <>
          <div className="">
            <h3 className="font-inter_tight font-medium puffer text-sm sm:text-base text-black">
              <a href={`/product/${product.slug}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
                {/* {defaultVariant?.name ? " — " + defaultVariant.name : ""} */}
              </a>
            </h3>
          </div>
          <p className="variant mt-1 text-xs sm:text-sm text-gray-500">
            {product.variants.items.length}{" "}
            {product.variants.items.length > 1 ? "variants" : "variant"} available
          </p>
        </>
        <p className="starting text-xs sm:text-sm font-normal text-gray-900 mt-3">
          Starting from{" "}
          <span className="text-sm sm:text-base font-medium">
            {process.env.NEXT_PUBLIC_CURRENCY_SIGN ?? product.price.code}
            {product.price.value}
          </span>
        </p>
      </div>
    </div>
  );
});

ProductItem.displayName = 'ProductItem';

const ProductPreviews: React.FC<ProductPreviewsProps> = ({ products, heading, gridClasses }) => {
  const memoizedProducts = useMemo(
    () => products.map((product: IProduct) => <ProductItem product={product} key={product.id} />),
    [products]
  );
  // console.log(products)
  // Console.log all products coming from the database

  return (
    <div className="bg-white">
      
      <div className="mx-auto max-w-2xl px-4 sm:px-6 -sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{heading}</h2>
        <div className={"mt-6 grid " + (gridClasses || "grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8")}>
          {memoizedProducts}
        </div>
      </div>
    </div>
  );
};

export default ProductPreviews;
