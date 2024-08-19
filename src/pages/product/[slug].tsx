/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import NavbarComponent from "@/components/Navbar/Navbar";
import { useRouter } from "next/router";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Head from 'next/head';
import "yet-another-react-lightbox/styles.css";
import { GetServerSidePropsContext } from "next";
import { connectToDatabase } from "@/util/mongodb";
import { shallow } from "zustand/shallow";
import { IOptionSelectNumber, IOptionSelectString, IProduct, IVariant, IVariantImage } from "@/types/products/product";
import { Chip, Select, SelectItem } from "@nextui-org/react";
import { IUseProductState, useProductState } from "@/zustand/product";
import dynamic from 'next/dynamic'
import { event } from "nextjs-google-analytics";
import { Ratings } from "@/components/product/Ratings";
import { AddToCart } from "@/components/product/AddToCart";
import Translations from "@/translate/en.json";
import { OptionSelect, OptionColorSelect } from "@/components/product/OptionHandlers";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { db } = await connectToDatabase();
  if (!context?.params?.slug || typeof context.params.slug !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const product = await db.collection<IProduct>("products").findOne({ slug: context.params.slug as string });
  if (!product) {
    return {
      notFound: true,
    };
  }
  const recommendations = await db.collection<IProduct>("products").find({ id: { $not: { $eq: product.id } } }).limit(4).toArray();
  
  return {
    props: { product: JSON.parse(JSON.stringify(product)), recommendations: JSON.parse(JSON.stringify(recommendations)) }
  };
}

const ModelViewerOriginal = dynamic(() => import('@/components/model-viewer/ModelViewerOriginal'), { ssr: true });

const CommentSection = dynamic(() => import('@/components/product/Comments'), { ssr: true });
const Description = dynamic(() => import('@/components/product/Description'), { ssr: false });
const ServicePolicy = dynamic(() => import('@/components/product/ServicePolicy'), { ssr: false });
const ProductPreviews = dynamic(() => import("@/components/ProductPreviews/ProductPreviews"), { ssr: true });
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
export const StripTags = (s: string) => s.replace(/(<([^>]+)>)/gi, "");
export default function Product({ product, rates, recommendations }: { recommendations: Array<IProduct>, product: IProduct, rates: ExchangeRateApiResponse }) {
  const productState: IUseProductState = useProductState();
  const variant = useProductState(state => state.variant);
  const price = useProductState(state => state.price);
  const [index, setIndex] = useState(-1);
  const [defaultVariant] = useState<IVariant>(
    product.variants.items.find(
      ({ id }) => id === product.variants.default,
    ) as IVariant,
  );
  const router = useRouter();
  useEffect(() => {
    event("product_view", {
      category: "product_views",
      product_id: product.id,
      variant_id: (defaultVariant).id,
    });
  }, []);

  useEffect(() => {
    productState.setProduct(product);
  }, [product]);

  useEffect(() => {
    productState.evaluatePrice();
    router.push({ query: { ...router.query, v: (variant ?? defaultVariant).id } }, undefined, { shallow: true });
    event("product_view", {
      category: "product_views",
      product_id: product.id,
      variant_id: (variant ?? defaultVariant).id,
    });
  }, [variant, defaultVariant]);


  // console.log(productState.product?.slug);
  let slug = productState.product?.slug;


  // function isLastCharNumber(str: any) {
  //   const lastChar = str.charAt(str.length - 1);
  //   return !isNaN(Number(lastChar));
  // }

  // console.log(isLastCharNumber(slug));


  return (
    <>
      <Head>
        {/* Title */}
        <title>{StripTags(`${StripTags(product.name)} - ${variant?.name ?? defaultVariant?.name ?? Translations["Meta:StoreName"]}`)}</title>

        {/* Meta Tags */}
        <meta name="description" content={StripTags(product.description)} />
        <meta name="keywords" content="Ecommerce, 3D, Free Models" />
        <meta name="author" content={Translations["Meta:StoreName"]} />

        {/* Open Graph Meta Tags (for sharing on social media) */}
        <meta property="og:title" content={Translations["Meta:StoreName"]} />
        <meta property="og:description" content={StripTags(product.description)} />
        <meta property="og:image" content={(variant ?? defaultVariant).images?.[0]?.src} />
        <meta property="og:url" content="URL of your website" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="bg-white">
        <NavbarComponent shadow={true} />
        <div className="pt-[7rem]">
          <ProductBreadcrumb />
          {/* Model Viewer */}
          <div id="model-viewer-wrapper" className="mx-auto m-max md:mb-6 rounded-lg mt-6 lg:mb-6 h-dvh max-h-[40rem] sm:px-0 container px-auto lg:px-0">
            {/* { isLastCharNumber(slug)? (<ModelViewerTwo/>) : (<ModelViewerOriginal/>)} */}
            <ModelViewerOriginal />
          </div>
          {/* Image Gallery */}
          <div className="product-image mx-auto sm:mt-0 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
      
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden  bg-gray-50 rounded-lg lg:block">
              
              {/*eslint-disable-next-line @next/next/no-img-element*/}
              <img
                onClick={() => setIndex(0)}
                src={((variant ?? defaultVariant)?.images?.[0].src)} alt="Product Image 1"
                className={`h-full w-full bg-gray-50 object-cover object-center ${variant?.images[0] ? "" : "hidden"}`}
              />
            </div>
            
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              
              {
                [...((variant ?? defaultVariant).images.slice(1, ((variant ?? defaultVariant).images.length - 1)))].flat()?.flatMap((image: IVariantImage, index: number) => (
                  <div
                    key={image.src}
                    className="aspect-h-2 aspect-w-3 bg-gray-50 overflow-hidden rounded-lg">
                    {/*eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={image.src} alt={"Product Image: " + (index + 1)}
                      className="h-full w-full ml-auto object-cover object-center mr-auto bg-gray-50"
                    />
                  </div>
                ))
              }
            </div>
            
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden  bg-gray-50 rounded-lg lg:block">
              
              {/*eslint-disable-next-line @next/next/no-img-element*/}
              <img
                onClick={() => setIndex((variant ?? defaultVariant)?.images?.length - 1)}
                src={((variant ?? defaultVariant)?.images[(variant ?? defaultVariant)?.images?.length - 1]?.src)} alt="Product Image 1"
                className={`h-full w-full bg-gray-50 object-cover object-center ${variant?.images[(variant ?? defaultVariant)?.images?.length - 1] ? "" : "hidden"}`}
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
              <div className="my-2 text-white flex gap-2">
                {(typeof product.metadata.stock === "boolean") ? (product.metadata.stock === "in-stock") ? <Chip variant="bordered" color="success">In stock</Chip> : <Chip variant="bordered" color="warning">Out of stock</Chip> : <Chip variant="bordered" color="success">In stock</Chip>}
                {'·'}{product.variants.items.map(({ name }) => <Chip key={name} variant="flat">{name}</Chip>)}
              </div>
              <small className="text-gray-500">Variant: {(variant ?? defaultVariant)?.name}</small>
            </div>

            {/* Product Information */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {price.toLocaleString('en', { style: "currency", currency: "GBP" })}
                {/* {((price * rates.conversion_rates['PKR'])).toLocaleString('en', { style: "currency", currency: "PKR" })} */}
              </p>
              <Ratings />
              <ServicePolicy />
              <div className="mt-5 text-white">
                {(typeof product.metadata.stock === "boolean") ? (product.metadata.stock === "in-stock") ? <Chip variant="bordered" color="success">In stock</Chip> : <Chip variant="bordered" color="warning">Out of stock</Chip> : <Chip variant="bordered" color="success">In stock</Chip>}
              </div>
              <div className="mt-0">
                {/* Sizes */}
                <div className="mt-5">
                  <h2 className="mb-4">Product variants</h2>
                  <Select
                    selectedKeys={[(variant ?? defaultVariant).id]}
                    onChange={e => {
                      if (e.target.value) productState.setVariant(e.target.value)
                    }}
                    label="Variants"
                    isRequired
                    placeholder="Select a variant"
                    className="max-w-xs text-black">
                    {product.variants.items.map((item) => <SelectItem textValue={item.name} key={item.id}><div className="text-black">{`${item?.name ?? item.id}`}</div></SelectItem>)}
                  </Select>
                  <hr className="mt-5" />
                  <div className="hidden items-center justify-between">
                    {/* <h3 className="text-sm font-medium text-gray-900">Size</h3> */}
                    <a
                      href="#"
                      className="text-sm font-medium text-[color:var(--primary-color)] hover:text-[color:var(--primary-color-2)]">
                      Size guide
                    </a>
                  </div>
                  <div>
                    {product.options?.map((option, index) => (
                      option.type === "select" && <OptionSelect opt={option} key={index} option={option.option as (IOptionSelectNumber | IOptionSelectString)} /> ||
                      option.type === "color-select" && <OptionColorSelect opt={option} key={index} option={option.option as (IOptionSelectString)} />
                    ))}
                  </div>
                </div>
                <AddToCart />
              </div>
            </div>
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Details</h3>
                <div className="space-y-6 py-4 overflow-hidden h-full px-4 bg-gray-50 border rounded-lg">
                  <Description description={product.description} slug={slug}/>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white">
            <ProductPreviews gridClasses="grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8" heading={'Customers also bought'} products={recommendations} />
            <div className="container mt-[5rem] max-w-7xl mx-auto px-4">
              {/* <CommentSection /> */}
              {/* <div
                data-chirpy-theme="system"
                data-chirpy-comment="true"
                id="chirpy-comment"
              ></div> */}
              {/* <DiscussionEmbed
                shortname="3decomstore"
                config={{
                  url: "https://ranforte.vercel.app/" + router.pathname,
                  identifier: product.id + (variant ?? defaultVariant)?.id,
                  title: product.name,
                  apiKey: process.env.NEXT_PUBLIC_DISQUS_PUBLIC_KEY,
                  language: "en", //e.g. for Traditional Chinese (Taiwan)
                  sso: {
                    name: "Ranforte",
                    button: "http://example.com/images/samplenews.gif",
                    icon: "http://example.com/favicon.png",
                    url: "http://localhost:3000/auth/login",
                    logout: "https://ranforte.vercel.app/auth/logout",
                    profile_url: "http://example.com/profileUrlTemplate/{username}",
                    width: "800",
                    height: "400",
                  },
                }}
              /> */}
              <CommentSection product={product} variantId={(variant ?? defaultVariant)?.id} />
            </div>
          </div>
        </div>
        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={(variant ?? defaultVariant)?.images ?? []}
          plugins={[Zoom, Thumbnails]}
        />
      </div>
      
    </>
  );
}

export function ProductBreadcrumb() {
  const router = useRouter();
  const [variantName, id] = useProductState(state => [state.variant?.name, state.variant?.id], shallow);
  const [name, slug] = useProductState(state => [state.product?.name, state.product?.slug], shallow);
  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {router.pathname
          .split("/")
          .slice(1, -1)
          .map((breadcrumb, index) => (
            <li key={breadcrumb + index}>
              <div className="flex items-center">
                <a
                  href={'/'}
                  className="mr-2 text-sm font-medium text-gray-900">
                  {breadcrumb.slice(0, 1).toUpperCase()}
                  {breadcrumb.slice(1)}
                </a>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
          ))}
        <li className="text-sm">
          <a
            href={slug}
            aria-current="page"
            className="font-medium text-gray-500 hover:text-gray-600">
            {name} — {variantName ?? id}
          </a>
        </li>
      </ol>
    </nav>
  )
}
function f(x: Partial<any>, prop: string) {
  delete x[prop];
}

export interface ExchangeRateApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [currencyCode: string]: number;
  };
}