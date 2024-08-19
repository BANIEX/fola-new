import PromotionalSection from '@/components/HeroSection/PromotionalSection'
import NavbarComponent from '@/components/Navbar/Navbar'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { CartElement } from '@/components/Cart/Cart'
import { IUserTokenClaims, IUser } from '@/types/auth/user'
import { ICart } from '@/types/cart/cart'
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken';
import mozjexl from 'mozjexl';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

export interface ICartExtended extends ICart {
  [x: string]: any
}
export async function getServerSideProps({ req, res }) {
  const userJWT = getCookie('auth.user', { req, res });
  if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
  if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
  try {
    const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
    if (typeof decoded === "string") throw new Error("Token could not be decoded.");
    const { db }: { db: Db } = await connectToDatabase();
    const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
    // if (!user) return ({ redirect: '/auth/login' })
    const cart = (await db.collection<ICart>("cart").aggregate([
      {
        $match: { owner: (user.id) }
      },
      {
        $unwind: "$items" // Unwind the items array to work with individual items
      },
      {
        $lookup: {
          from: "products",
          localField: "items.id",
          foreignField: "id",
          as: "product"
        }
      },
      {
        $unwind: "$product" // Unwind the product array to work with individual product documents
      },
      {
        $group: {
          _id: "$_id",
          owner: { $first: "$owner" },
          createdAt: { $first: "$createdAt" },
          id: { $first: "$id" },
          modifiedAt: { $first: "$modifiedAt" },
          items: {
            $push: {
              id: "$items.id",
              configuration: "$items.configuration",
              product: "$product" // Attach the product details to each item
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          owner: 1,
          createdAt: 1,
          id: 1,
          modifiedAt: 1,
          items: 1
        }
      }
    ]).toArray())?.[0] as ICartExtended;
    // (await require("fs")).writeFileSync("/Users/asadrizvi/Documents/Projects/work/toxic/web/public/static/test-dump.json", JSON.stringify(cart));
    if (!cart) return ({ props: { cartEmpty: true } });
    cart['total'] = 0;
    for (const item of cart.items) {
      item['total'] = item.product?.price.value;
      const variant = item.product?.variants.items.find(({ id }) => id === item.configuration.variant.id);
      const options = item.product?.options.filter(({ id }) => item.configuration.options?.findIndex(({ id: _id }) => _id === id) === -1) ?? [];
      item['total'] += parseFloat(await mozjexl.eval(variant?.priceModifier, { product: item.product, variant }).catch(() => (-1)));
      for (const option of options) item['total'] += parseFloat(await mozjexl.eval(option?.option.priceModifier, {
        product: item.product, variant, selection: {
          index: option.option?.options?.findIndex((value: string | number) => value === item.configuration.options.find(({ id }) => id === option.id)?.value),
        }
      }).catch(() => (-1)));
      cart['total'] += item['total'];
    }
    // console.log(cart);    // (await require("fs")).writeFileSync("/Users/asadrizvi/Documents/Projects/work/toxic/web/public/static/test-dump.json", JSON.stringify(cart));
    // (await require("fs")).writeFileSync("/Users/asadrizvi/Documents/Projects/work/toxic/web/public/static/test-dump.json", JSON.stringify(cart));

    return ({ props: { cart: JSON.parse(JSON.stringify(cart)) } })
  } catch (e: any) {
    console.log(e);
    return {props: { cartEmpty: true } }
    // return ({ redirect: '/auth/login' })
  }
}
export default function Home({ cart, cartEmpty: _cartEmpty }: { cartEmpty: boolean, cart: ICart }) {
  const [cartData, setCardData] = useState(cart);
  const [cartEmpty, setCartEmpty] = useState(_cartEmpty);
  useEffect(() => {
    if (!cartData?.items?.length) setCartEmpty(true);
  }, [cartData]);
  return (
    <div className="bg-white">
      <NavbarComponent shadow={true} />
      <div className="relative overflow-hidden bg-white">
        <div className="pb-40 pt-16 sm:pb-20 sm:pt-24 lg:pb-40 lg:pt-40">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <CartElement onItemRemoval={(d) => setCardData(a => ({ ...a, items: d }))} cart={cartData} />
            {cartEmpty && (
              <div>
                <div className="relative mx-auto mt-[6rem] max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                  <div className="sm:max-w-7xl flex flex-col gap-2 items-center content-center text-center">
                    <><ShoppingCartIcon className="w-[5rem]" /></>
                    <h1 className="text-lg font-bold tracking-tight text-gray-900 sm:text-3xl">
                      Cart Empty
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                      Your Cart is currently empty. Add a product and check back here.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <PromotionalSection />
    </div>
  )
}