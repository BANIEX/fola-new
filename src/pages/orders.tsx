import PromotionalSection from '@/components/HeroSection/PromotionalSection'
import NavbarComponent from '@/components/Navbar/Navbar'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { OrderElement } from '@/components/Cart/Cart'
import { IUserTokenClaims, IUser } from '@/types/auth/user'
import { IOrder } from '@/types/cart/cart'
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import Footer from '@/components/Footer/Footer';
import ShoppingCartIcon from '@heroicons/react/20/solid/ShoppingCartIcon';
import { ClipboardDocumentIcon } from '@heroicons/react/20/solid';

interface IOrderExtended extends IOrder {
  [x: string]: any
}
export async function getServerSideProps({ req, query, res }: GetServerSidePropsContext) {
  const userJWT = getCookie('auth.user', { req, res });
  if (!userJWT) return ({ redirect: '/error?d=No token attached to request' });
  if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
  try {
    const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
    if (typeof decoded === "string") return ({ redirect: '/error?d=Token could not be decoded.' });

    const { db }: { db: Db } = await connectToDatabase();
    const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
    if (!user) return ({ redirect: '/auth/login' });
    const filter = query.highlight ? { id: query.highlight?.toString(), owner: user.id } : { owner: user.id };
    const orders = (await db.collection<IOrder>("orders").find(filter).sort({_id:-1}).toArray()) as IOrderExtended[];
    return ({ props: { orders: JSON.stringify(orders) } })
  } catch (e: any) {
    return ({ redirect: '/auth/login' })
  }
}
export default function Home({ orders }: { orders: Array<IOrder[]> }) {
  orders = JSON.parse(orders);
  return (
    <div className="bg-white">
      <NavbarComponent shadow={true} />
      <div className="relative overflow-hidden bg-white">
        <div className="pb-40 pt-16 sm:pb-20 sm:pt-24 lg:pb-40 lg:pt-40">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            {orders && orders.map(order => (<div key={order.id} className="my-4"><OrderElement heading="Order" order={order} /></div>))}
            {!orders?.length && (
              <div>
                <div className="relative mx-auto mt-[6rem] max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                  <div className="sm:max-w-7xl flex flex-col gap-2 items-center content-center text-center">
                    <><ClipboardDocumentIcon className="w-[5rem]" /></>
                    <h1 className="text-lg font-bold tracking-tight text-gray-900 sm:text-3xl">
                      No Orders
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                      You don't have any orders. Create an order and check back here.
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
      <Footer />
    </div>
  )
}