import HeroSection from '@/components/HeroSection/HeroSection'
import PromotionalSection from '@/components/HeroSection/PromotionalSection'
import ProductPreviews from '@/components/ProductPreviews/ProductPreviews'
import NavbarComponent from '@/components/Navbar/Navbar'
// import Footer from '@/components/Footer/Footer'
import { IProduct } from '@/types/products/product';
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import Head from 'next/head';

// import { Canvas } from '@react-three/fiber';
// import {OrbitControls} from '@react-three/drei'
// import Suitcase from '../../public/Suitcase'
// import ThreeD from '@/components/ThreeD/ThreeD';

export async function getServerSideProps() {
  const { db }: { db: Db } = await connectToDatabase();
  const products = await db.collection<IProduct>("products").find({}).limit(50).toArray();


  return {
    props: { products: JSON.parse(JSON.stringify(products)) }
  }
}



export default function Home({ products }: { products: Array<IProduct> }) {
  return (
    <>
      <Head>
        <title>Ranforte</title>
        <meta name="description" content="Learn about our company, where creativity meets innovation, and excellence is our standard." />
        <meta name="keywords" content="about us, company, creativity, innovation, excellence" />
      </Head>
      <div className="bg-white flex flex-col gap-10">
        <NavbarComponent shadow={true} />
        <HeroSection />
        {/* <Canvas>
          <ambientLight/>
          <OrbitControls/>
          <Suitcase />
        </Canvas> */}
        {/* <ThreeD/> */}

        <ProductPreviews gridClasses="border-b pb-[5rem] grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl xl:gap-x-8" 
          products={products} />
        <PromotionalSection />
      </div>
    </>
  )
}