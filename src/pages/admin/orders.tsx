import { PencilIcon as EditIcon, TrashIcon as DeleteIcon } from '@heroicons/react/24/outline'
import React, { Fragment, Suspense, useEffect, useState } from "react";
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { IOrder } from "@/types/cart/cart";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Select, SelectItem } from "@nextui-org/react";
import dynamic from 'next/dynamic';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useFetch } from '@/hooks/useFetch';
import { OrderElement } from '@/components/Cart/Cart';
import { EyeIcon } from '@heroicons/react/20/solid';


const TimeAgo = dynamic(() => import("react-timeago"));

const columns = [
    { name: "ID", uid: "id" },
    { name: "CREATED BY", uid: "owner" },
    { name: "TOTAL", uid: "total" },
    { name: "DATE ADDED", uid: "createdAt" },
    { name: "STATUS", uid: "status" },
    { name: "ADDRESS", uid: "address" },
    { name: "PAYMENT", uid: "payment" },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
    delivered: "success",
    "out-for-delivery": "warning",
    "recieved": "danger",
};

export default function Orders() {
    const handleOrderDeletion = (id: string) => {
        setDeletedOrders(state => ([...state, id]));
        fetch('/api/admin/edit-order', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id,
                delete: true
            })
        });
    }


    const handleOrderStatusUpdate = (id: string, status: string) => fetch('/api/admin/edit-order', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            id, status,
            edit: true
        })
    });
    const renderCell = React.useCallback((order: IOrder, columnKey: string | number) => {
        const cellValue = order[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{order.id.slice(0, 20)}...</p>
                    </div>
                );
            case "owner":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{order?.user.email}</p>
                    </div>
                );
            case "address":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{order?.billing.address + ' — ' + order.billing.postalCode ?? 'N/A'}</p>
                    </div>
                );
            case "total":
                return (
                    <div className="flex gap-3 flex-col">
                        <Chip>{order.items.length} Items</Chip> <p className="text-bold text-sm">{process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString() ?? ""}{order?.total.toFixed(2)}</p>
                    </div>
                );
            case "createdAt":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">
                            <TimeAgo date={order.createdAt.toString()} />
                        </p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={(statusColorMap[order.status] as ("danger" | "success" | "warning"))} size="sm" variant="flat">
                        {order.status?.toString() ?? 'unknown'}
                    </Chip>
                );
            case "payment":
                return (
                    <Chip className="capitalize" color={order.payment.confirmed ? "success" : "warning"} size="sm" variant="flat">
                        {order.payment.confirmed ? "Confirmed" : "Pending"}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-3 text-black">
                        <Tooltip className='text-black' content="Change Status">
                            <span className="text-lg w-full text-default-400 cursor-pointer active:opacity-50">
                                <Select
                                    label="Order status"
                                    defaultSelectedKeys={[order.status]}
                                    isRequired onChange={(e) => e.target.value && handleOrderStatusUpdate(order.id, e.target.value)}
                                    placeholder="Select an Order status"
                                    className="max-w-xs">
                                    {[{ label: 'Delivered', value: 'delivered' }, { label: 'Out for shipping', value: 'out-for-shipping' }, { label: 'Recieved', value: 'recieved' }].map((option) => (
                                        <SelectItem className="text-black" key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </span>
                        </Tooltip>
                        <Tooltip className='text-black' color="danger" content="View Order">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <EyeIcon onClick={() => handleOrderView(order.id)} className='w-[1rem]' />
                            </span>
                        </Tooltip>
                        <Tooltip className='text-black' color="danger" content="Delete Order">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon onClick={() => handleOrderDeletion(order.id)} className='w-[1rem]' />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [deletedOrders, setDeletedOrders] = useState<string[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [order, setOrder] = useState<string | null>(null);
    const handleOrderView = (id: string) => {
        setOrder(id);
        onOpen();
    }
    useEffect(() => {
        fetch('/api/admin/orders').then(res => res.json()).then(r => setOrders(r.items));
    }, []);
    return (
        <>
            <div className="min-h-full">
                <div className={"bg-white relative"}>
                    <Sidebar embedded={false} />
                    <div className="sm:ml-[20rem]">
                        <Navbar />
                        <OrderViewer isOpen={isOpen && order} onOpenChange={() => {
                            setOrder(null);
                            onOpenChange();
                        }} orderId={order} />
                        <div className="p-4">
                            <div className='flex w-full pb-1 space-between'>
                                <div style={{ flexGrow: "1 1 auto", flex: 1 }} />
                            </div>

                            <div className="grid grid-cols-1 overflow-scroll w-full max-w-7xl gap-2">
                                <Table shadow='none' disabledKeys={deletedOrders} fullWidth removeWrapper aria-label="Example table with custom cells">
                                    <TableHeader columns={columns}>
                                        {(column) => (
                                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                                {column.name}
                                            </TableColumn>
                                        )}
                                    </TableHeader>
                                    <TableBody emptyContent={'No orders found'} items={orders}>
                                        {(item) => (
                                            <TableRow key={item.id}>
                                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function OrderViewer({ isOpen, onOpenChange, orderId }: { isOpen: boolean, onOpenChange: () => void, orderId: string }) {
    const [state, setState] = useState({ data: null, error: false });
    useEffect(() => {
        if (orderId) fetch('/api/admin/get-order-info', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({ id: orderId })
        }).then(d => d.json()).then((r) => setState({ data: r.order, error: false }));
        return () => setState({data: null, error: false});
    }, [orderId])
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Viewing Order: {orderId}</ModalHeader>
                            <ModalBody>
                                <div>{state.data && <OrderElement admin={true} order={state.data} />}</div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
