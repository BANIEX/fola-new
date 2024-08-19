import { IProduct } from '@/types/products/product';
import { useSearchState } from '@/zustand/product';
import React, { FC, useEffect, useState } from 'react';


interface SearchProps { }
const ProductSearchItem = ({ product }: { product: IProduct }) => {
  const defaultVariant = product.variants.items.find(({ id }) => id === product.variants.default);
  return (
    <li key={product.id} className="flex py-6">
      <div className="h-24 md:xl:w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={defaultVariant?.images[0].src}
          alt={"Product Image"}
          className="h-full w-auto object-cover object-center"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>
            <a href={`/product/${product.slug}`}>
              {`${product.name} ${defaultVariant?.name ? ' — ' + defaultVariant.name : ''}`.slice(0, 30)}
            </a>
          </h3>
          <p className="ml-4">Starting from {product.price.value} {product.price.code}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{product.variants.items.length} {product.variants.items.length ? 'variants' : 'variant'} available</p>
      </div>
    </li>
  )
}
const Search: FC<SearchProps> = () => {
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const query = useSearchState(state => state.query);
  // const setQuery = useSearchState(state => state.setQuery);
  // const toggleOpen = useSearchState(state => state.toggleOpen);
  useEffect(() => {
    const queryController = new AbortController();
    if (query && query.length) fetch('/api/product/search?q=' + query, {
      method: 'get', signal: queryController.signal
    }).then(res => res.json()).then(res => res.items).then(setProducts);
    else {
      setProducts([]);
      // setQuery("");
      // toggleOpen();
    }
    return () => queryController.abort();
  }, [query]);
  return (
    <>
      <div className={"bg-white rounded md:xl:mr-5- shadow-xl " + (products.length > 0 ? "py-5 px-4" : "hidden")}>
        <div className="flow-root">
          <ul role="list" className="overflow-scroll scroll divide-y divide-gray-200">
            {products.map((product) => <ProductSearchItem product={product} key={product.id} />)}
          </ul>
        </div>
      </div>
    </>
  );
}
export default Search;
