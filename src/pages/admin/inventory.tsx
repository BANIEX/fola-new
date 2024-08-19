import { Fragment, memo } from "react";
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import dynamic from 'next/dynamic';

const ProductsTable = dynamic(() => import('@/components/admin/AllProductTable'));
const EditProduct = dynamic(() => import('@/components/admin/EditProduct'));
const ViewProduct = dynamic(() => import('@/components/admin/ViewProductDetails'));

const Inventory = () => {
    return (
        <Fragment>
            <div className="min-h-full">
                <div className="bg-white relative">
                    <Sidebar embedded={false} />
                    <div className="sm:ml-[20rem]">
                        <Navbar />
                        <div className="p-4">
                            <div className="grid grid-cols-1 overflow-scroll max-w-7xl -md:xl:grid-cols-2 gap-2">
                                <ProductsTableMemo route={'inventory'} />
                            </div>
                        </div>
                    </div>
                    <EditProduct />
                    <ViewProduct />
                </div>
            </div>
        </Fragment>
    );
};

const ProductsTableMemo = memo(ProductsTable);

export default Inventory;
