// import { PencilIcon as EditIcon, TrashIcon as DeleteIcon, EyeIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, Spinner, Avatar, Select, SelectItem } from "@nextui-org/react";
import { IProduct, IProductPrice, IVariant } from '@/types/products/product';
import { useFetch } from "@/hooks/useFetch";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { useProductEditorDialogState, useProductEditorState, useProductViewState, useProductViewDialogState } from "@/zustand/page";
import users from "@/pages/admin/users";
const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};
const columns = [
    { name: "ID", uid: "id" },
    { name: "NAME", uid: "name" },
    { name: "PRICE", uid: "price" },
    { name: "VARIANTS", uid: "variants" },
    { name: "AVAILABLE", uid: "available" },
    { name: "ACTIONS", uid: "actions" },
    { name: "OPEN", uid: "open" },
];

export default function ProductsTable({ route }: { route: string }) {

    // const { data: products, error } = useFetch<{ status: 'valid' | 'error', description: string, items: Array<IProduct>, slice: [number, number] }>(`/api/admin/${route}`, {
    //     credentials: "include"
    // });
    const [products, setData] = useState<{ status: 'valid' | 'error', description: string, items: Array<IProduct>, slice: [number, number] }>(null);
    const [error, setError] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<string[]>([]);
    const toggleOpen = useProductEditorDialogState(state => state.toggleOpen);
    const changeData = useProductEditorState(state => state.onDataChange);
    const toggleOpenDetails = useProductViewDialogState(state => state.toggleOpen);
    const changeDataDetails = useProductViewState(state => state.onDataChange);
    useEffect(() => {
        fetch(`/api/admin/${route}`, {
            credentials: "include"
        }).then(res => res.json()).then(setData).catch(() => setError(true));
    }, []);
    const handleDeleteProduct = async (id: string) => {
        setDisabled(d => [...d, id]);
        await fetch('/api/product/delete', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id })
        }).catch();
        setDisabled(d => d.filter(a => a !== id));
        setData(d => ({ ...d, items: d.items.filter(a => a.id !== id) }));
    }
    const handleEditProduct = (product: IProduct) => {
        changeData(product);
        toggleOpen(true);
    }
    const handleViewProduct = (product: IProduct) => {
        changeDataDetails(product);
        toggleOpenDetails(true);
    }

    const handleProductUpdate = (product: IProduct) => {
        fetch('/api/product/update', {
            method: "post",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(product)
        });
    }
    const renderCell = React.useCallback((product: IProduct, columnKey: React.Key) => {
        const cellValue = product[columnKey as keyof IProduct];

        switch (columnKey) {
            case "id":
                return (
                    <p className="text-bold text-sm capitalize">{(cellValue as string).slice(0, 8)}...</p>
                );
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
                        <p className="text-bold text-sm capitalize">{process.env.NEXT_PUBLIC_CURRENCY_SIGN.toString()}{(cellValue as IProductPrice).value.toString()}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{(cellValue as IProductPrice).code.toString()}</p>
                    </div>
                );
            case "available":
                return (
                    <div>
                        <Select
                            items={[{ key: 'in-stock', name: 'In Stock' }, { key: 'out-of-stock', name: 'Out of stock' }]}
                            variant="bordered"
                            defaultSelectedKeys={[product.metadata.stock ?? "in-stock"]}
                            label="Availability"
                            onChange={(e) => e.target.value && handleProductUpdate({...product, metadata: {...product.metadata, stock: e.target.value}})}
                            labelPlacement="inside"
                            classNames={{
                                base: "max-w-xs",
                                trigger: "min-h-unit-12 py-2",
                            }}
                            renderValue={(items) => {
                                return (
                                    <div className="flex flex-wrap mt-1 gap-2">
                                        {items.map((item) => (
                                            <Chip key={item.key} className="capitalize" color={item.key === "out-of-stock" ? 'danger' : 'success'} size="sm" variant="flat">
                                                {item.data?.name}
                                            </Chip>
                                        ))}
                                    </div>
                                );
                            }}>
                            {(user) => (
                                <SelectItem key={user.key} textValue={user.name}>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex flex-col">
                                            <span className="text-small text-black">{user.name}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            )}
                        </Select>
                    </div>
                );
            case "variants":
                return (
                    <><span className="mr-5">{(cellValue as {
                        default: string,
                        items: Array<IVariant>
                    }).items.length} variants available</span><div className="flex gap-1">{(cellValue as {
                        default: string,
                        items: Array<IVariant>
                    }).items.map((variant) => <Chip key={variant.id} className="capitalize" size="sm" variant="flat">
                        {(variant.name ?? variant.id).slice(0, 10)}
                    </Chip>)}</div></>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip className="text-default-400" content="Details">
                            <span onClick={() => handleViewProduct(product)} className="text-lg text-default-400 w-[20px] h-[20px] cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip className="text-default-400" content="Edit Item">
                            <span onClick={() => handleEditProduct(product)} className="text-lg text-default-400 w-[20px] h-[20px] cursor-pointer active:opacity-50">
                                <PencilIcon />
                            </span>
                        </Tooltip>
                        <Tooltip className="text-white" color="danger" content="Delete Item">
                            <span onClick={() => handleDeleteProduct(product.id)} className="text-lg text-danger w-[20px] h-[20px] cursor-pointer active:opacity-50">
                                <TrashIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            case "open":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip className="text-default-400" content="Open Product">
                            <a href={`/product/${product.slug}`} target="_blank" className="text-default-400 h-[20px] w-[20px]">
                                <span className="text-lg text-default-400 w-[20px] h-[20px] cursor-pointer active:opacity-50">
                                    <ArrowTopRightOnSquareIcon />
                                </span>
                            </a>
                        </Tooltip>
                    </div>
                );
            default:
                return <div>{JSON.stringify(cellValue)}</div>;
        }
    }, []);
    if (error) return <p>There is an error.</p>;
    return (
        <Table disabledKeys={disabled} fullWidth aria-label="Example table with custom cells" removeWrapper shadow="none">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={"center"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                // emptyContent={'No products found'}
                isLoading={!products && !error}
                loadingContent={<div><Spinner label="Loading..." /></div>} items={products?.items ?? []}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
