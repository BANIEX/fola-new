// import { PencilIcon as EditIcon, TrashIcon as DeleteIcon, EyeIcon } from '@heroicons/react/24/outline'
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps } from "@nextui-org/react";
import { IProduct } from '@/types/products/product';
import { use } from 'react';
import { useFetch } from "@/hooks/useFetch";
const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};
const columns = [
    // { name: "ID", uid: "id" },
    { name: "NAME", uid: "name" },
    // { name: "PRICE", uid: "price" },
    // { name: "VARIANTS", uid: "variants" },
    // { name: "ACTIONS", uid: "actions" },
];

export default function ProductsTable({route}: {route: string}) {

    const { data: products, error } = useFetch<{ status: 'valid' | 'error', description: string, items: Array<IProduct>, slice: [number, number] }>(`/api/admin/${route}`, {
        credentials: "include"
    });

    const renderCell = React.useCallback((product: IProduct, columnKey: React.Key) => {
        const cellValue = product[columnKey as keyof IProduct];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: product.variants.items[0].images[0].src }}
                        description={"Product Image"}
                        name={(columnKey === "name" || columnKey === "price" || columnKey === "id") ? cellValue?.toString() : columnKey === "variants" ? product.variants.items + " variants" : ""}>
                        {cellValue?.toString()}
                    </User>
                );
            case "price":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue?.toString()}</p>
                        {/* <p className="text-bold text-sm capitalize text-default-400">{user.team}</p> */}
                    </div>
                );
            // case "status":
            //     return (
            //         <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            //             {cellValue}
            //         </Chip>
            //     );
            // case "actions":
            //     return (
            //         <div className="relative flex items-center gap-2">
            //             <Tooltip content="Details">
            //                 <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            //                     <EyeIcon />
            //                 </span>
            //             </Tooltip>
            //             <Tooltip content="Edit user">
            //                 <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            //                     <EditIcon />
            //                 </span>
            //             </Tooltip>
            //             <Tooltip color="danger" content="Delete user">
            //                 <span className="text-lg text-danger cursor-pointer active:opacity-50">
            //                     <DeleteIcon />
            //                 </span>
            //             </Tooltip>
            //         </div>
            //     );
            default:
                return cellValue;
        }
    }, []);

    if (!products) return <p>Loading...</p>
    if (error) return <p>There is an error.</p>
    return (
        <Table aria-label="Example table with custom cells" removeWrapper shadow="none">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'No products found'} items={products.items}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
