import NavbarComponent from "@/components/Navbar/Navbar";
import Translations from "@/translate/en.json";
import Head from "next/head";
import Image from "next/image";
import Tutorial from "@/components/tutorial/Tutorial";

const AboutUsPage = () => {
    return (
        <>
            <Head>
                <title>About {Translations['Meta:StoreName']}</title>
                <meta name="description" content="Learn about our company, where creativity meets innovation, and excellence is our standard." />
                <meta name="keywords" content="about us, company, creativity, innovation, excellence" />
            </Head>
            <NavbarComponent />
            <div className="bg-white min-h-screen mt-32 flex flex-col space-y-6 items-center">
                <div className="w-[90vw] md:max-w-4xl border-2 border-slate-200 rounded-xl p-8">
                    <h1 className="text-4xl font-extrabold mb-6 text-gray-800">About Ranforte</h1>
                    <p className="text-gray-700 mb-8">
                        The goal of Ranforte is to transform the online shopping experience by incorporating 3D models directly into product pages. This innovative approach goes beyond static images, allowing you to fully interact with displayed products in a virtual environment. By fostering a sense of realism and authenticity, 3D models empower you to examine products from all angles and gain a more comprehensive understanding of their design and functionality.
                    </p>
                </div>
                <div className="w-[90vw] md:max-w-4xl border-2 border-slate-200 rounded-xl p-8 ">
                    <div className="border-b-2">
                    <h1 className="text-4xl font-extrabold mb-6 text-gray-800">How to use</h1>
                    <p className="text-gray-700 mb-8">
                        Unlock Ranforte's potential with this comprehensive tutorial section, designed to guide you through every step of examining the product.
                    </p>

                    </div>
                    <Tutorial />
                </div>
                <div className="w-[90vw] md:max-w-4xl border-2 border-slate-200 rounded-xl p-8">
                    <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Incoming Features</h1>
                    <p className="text-gray-700 mb-8">
                        <span className="font-semibold">E-wallet:</span> In the future, Ranforte will look to add an e-wallet function in order to simplify payment. This will enable one-click payment and let you spend more time examining your favourite product.
                    </p>
                    <p className="text-gray-700 mb-8">
                        <span className="font-semibold">Voice Reader:</span> Also looking to add a voice reader to foster inclusivity for blind users who still want to browse about their favourite products. Ranforte aims to give the effect of a real-world store that offers assistance to customers who cannot see or clearly decipher products.
                    </p>

                </div>
                <div className="w-[90vw] md:max-w-4xl border-2 border-slate-200 rounded-xl p-8">
                    <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Developer Info</h1>
                    <div className="flex flex-col gap-4">
                        <span className="flex flex-row gap-4 items-center"><Image src='/user.png' height={24} width={24} alt="name"/> Popoola-Smith Michael</span>
                        <span className="flex flex-row gap-4 items-center"><Image src='/university.png' height={24} width={24} alt="name"/>Dept. of Computer Science and Informatics, University of Sussex</span>
                        <span className="flex flex-row gap-4 items-center"><Image src='/mail.png' height={24} width={24} alt="name"/>mikesmithuser001@gmail.com</span>

                    </div>
                </div>


            </div>
        </>
    );
};

export default AboutUsPage;