/* trunk-ignore-all(prettier) */
import { CircleStackIcon, HomeIcon, PlusIcon, PresentationChartBarIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import Translations from "@/translate/en.json"
import CreateProduct from '@/components/admin/CreateProduct';

const options = [
    {
        name: "Dashboard", href: "/admin", description: "Overview product statistics, and orders", icon: HomeIcon
    },
    {
        name: "Inventory", href: "/admin/inventory", description: "View and Edit inventory", icon: CircleStackIcon
    },
    {
        name: "Users", href: "/admin/users", description: "View and change user roles", icon: UserCircleIcon
    },
    {
        name: "Orders", href: "/admin/orders", description: "View and change orders", icon: PresentationChartBarIcon
    }
]
const iconClasses = "text-xl text-default-500 pointer-events-none w-[20px] h-[20px] flex-shrink-0";
export default function Sidebar({ embedded }: { embedded: boolean }) {
    return (
        <aside id="default-sidebar" className={(embedded ? "z-60 w-full" : "fixed transition-transform -translate-x-full sm:translate-x-0 shadow-sm border-r-1 border-gray-200  z-40 w-[20rem]") + " top-0 left-0 h-screen"} aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto -bg-gray-50">
                <Listbox>
                    <ListboxItem href="/" key="logo" startContent={<div className="flex-shrink-0">
                    </div>} className="mb-4">
                        <strong>{Translations["Meta:StoreName"]}</strong>
                    </ListboxItem>
                    <ListboxSection title="Views" showDivider>
                        {/*@eslint-ignore*/}
                        {...options.map((a) => <ListboxItem description={a.description}
                            startContent={<a.icon className={iconClasses} />} key={a.name} href={a.href}>
                            {a.name}
                        </ListboxItem>)}
                    </ListboxSection>
                </Listbox>
                <CreateProduct />
            </div>
        </aside>
    )
}