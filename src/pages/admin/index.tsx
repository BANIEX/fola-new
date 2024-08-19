import dynamic from 'next/dynamic';
import { useFetch } from '@/hooks/useFetch';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ProductsTable = dynamic(() => import("@/components/admin/ProductTable"), { ssr: false });
const Navbar = dynamic(() => import('@/components/admin/Navbar'), { ssr: false });
const Sidebar = dynamic(() => import('@/components/admin/Sidebar'), { ssr: false });

const AbandonedCartChart = () => {
    const { data, error } = useFetch<{percentage: number}>('/api/admin/analytics/abandoned-carts');
    return (
        <>
            {(!data && !error) && <div>Loading...</div>}
            {(error) && <div>An Error Occurred (see console)</div>}
            {data && (
                <Chart
                    options={{ labels: ['Abandoned', 'Completed'] }}
                    series={[data.percentage, (100 - data.percentage)]}
                    type="donut"
                    width={'100%'}
                    height={320}
                />
            )}
        </>
    );
};

const Admin = () => {
    return (
        <>
            <div className="min-h-full">
                <div className={"bg-white relative"}>
                    <Sidebar embedded={false} />
                    <div className="sm:ml-[20rem]">
                        <Navbar />
                        <div className="p-4">
                            <div className="grid grid-cols-1 overflow-scroll md:xl:grid-cols-2 gap-2">
                                <div className="shadow-md- border py-4 px-3 w-full rounded">
                                    <h4>Top performing products</h4>
                                    <p className="text-gray-500 text-sm capitalize pb-4">
                                        These products did best during the past week
                                    </p>
                                    <ProductsTable route={'inventory'} />
                                </div>
                                <div className="shadow-md- border py-4 px-4 w-full rounded">
                                    <AbandonedCartChart />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;
