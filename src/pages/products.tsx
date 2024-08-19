import NavbarComponent from "@/components/Navbar/Navbar";
import ProductPreviews from "@/components/ProductPreviews/ProductPreviews";
import { Input, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from 'react';
import { IProduct } from '@/types/products/product';
import { connectToDatabase } from "@/util/mongodb";
import { TagIcon } from "@heroicons/react/20/solid";

interface Filters {
    minPrice: number | undefined;
    maxPrice: number | undefined;
    sort: string;
}
export const getServerSideProps = async () => {
    const { db } = await connectToDatabase();
    return ({
        props: {
            categories: JSON.parse(JSON.stringify(await db.collection("products").aggregate([
                // Unwind the array fields
                { $unwind: "$categories" },
                // Group all unique items
                {
                    $group: {
                        _id: null,
                        uniqueItems: { $addToSet: "$categories" }
                    }
                }
            ]).toArray()))[0].uniqueItems || []
        }
    })
}
const ProductsPage: React.FC = ({ categories }: { categories: Array<string> }) => {
    const [filters, setFilters] = useState<Filters>({
        minPrice: 0,
        maxPrice: undefined,
        sort: 'highestToLowest',
    });
    const [selectedCat, setSelectedCat] = useState(null);
    const [data, setData] = useState<{ items: IProduct[] } | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/product/get-products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...filters, category: selectedCat}),
                });
                const jsonData = await res.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [filters, selectedCat]);
    return (
        <>
            <NavbarComponent />
            <div className="bg-white min-h-screen w-full mr-auto ml-auto pt-[5rem] md:lg:pt-[10rem] max-w-7xl grid grid-cols-4">
                <aside className="col-span-4 sm:mt-5 md:lg:col-span-1 w-full h-full" aria-label="Sidebar">
                    <div className="h-auto px-3 py-4 overflow-y-auto -md:lg:shadow-md -md:lg:rounded-xl bg-white md:lg:border- md:lg:w-lg">
                        <ul className="space-y-2 font-medium">
                            <li className="-p-2">
                                <div className="flex items-center p-2 w-full text-base text-gray-900 rounded-lg group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        <div>Price Range</div>
                                        <div className="flex space-between -grid-grid-cols-2">
                                            <Input
                                                onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, minPrice: !e.target.value ? undefined : parseInt(e.target.value) }))}
                                                size="sm"
                                                type="number"
                                                value={filters.minPrice || '0'}
                                                label="Min price"
                                                labelPlacement="outside"
                                                startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">{process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString() ?? ""}</span></div>}
                                            />
                                            <Input
                                                size="sm"
                                                className="ml-4"
                                                type="number"
                                                value={filters.maxPrice || ''}
                                                label="Max price"
                                                labelPlacement="outside"
                                                startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">{process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString() ?? ""}</span></div>}
                                                onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, maxPrice: !e.target.value ? undefined : parseInt(e.target.value) }))}
                                            />
                                        </div>
                                    </span>
                                </div>
                            </li>
                            <li className="-p-2">
                                <div className="flex items-center p-2 w-full text-base text-gray-900 rounded-lg group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                        <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 gap-2 text-left rtl:text-right whitespace-nowrap">
                                        <div>Sort prices</div>
                                        <div className="flex space-between -grid-grid-cols-2">
                                            <Select
                                                selectedKeys={[filters.sort]}
                                                onSelectionChange={key => setFilters((prevFilters) => ({ ...prevFilters, sort: [...key][0] }))}
                                                placeholder="Select an option"
                                                className="max-w-xs"
                                            >
                                                <SelectItem className="text-black" key={"lowestToHighest"} value={"lowestToHighest"}>
                                                    Lowest to highest
                                                </SelectItem>
                                                <SelectItem className="text-black" key={"highestToLowest"} value={"highestToLowest"}>
                                                    Highest to Lowest
                                                </SelectItem>
                                            </Select>
                                        </div>
                                    </span>
                                </div>
                            </li>
                            <li className="-p-2">
                                <div className="flex items-center p-2 w-full text-base text-gray-900 rounded-lg group" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <TagIcon />
                                    </svg>
                                    <span className="flex-1 ms-3 gap-2 text-left rtl:text-right whitespace-nowrap">
                                        <div>Categories</div>
                                        <div className="flex space-between -grid-grid-cols-2">
                                            <Select
                                                selectedKeys={[selectedCat ?? 'All']}
                                                onSelectionChange={key => setSelectedCat(() => ([...key][0]))}
                                                placeholder="Select a category"
                                                classNames={{ value: "capitalize" }}
                                                className="max-w-xs capitalize"
                                            >
                                                {categories.map((cat, index) => (
                                                    <SelectItem className="capitalize text-black" key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </aside>
                <div className="w-full col-span-4 md:lg:col-span-3">
                    {data?.items && <ProductPreviews gridClasses="grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8" products={data?.items} />}
                </div>
            </div>
        </>
    );
};

export default ProductsPage;
