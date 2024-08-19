import {PencilIcon as EditIcon, TrashIcon as DeleteIcon, } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from "react";
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { IUser } from '@/types/auth/user';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from "@nextui-org/react";
import { PlusCircleIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';
import { useAccountState } from '@/zustand/account';
import { useRouter } from 'next/router';

const columns = [
    { name: "NAME", uid: "name" },
    { name: "EMAIL", uid: "email" },
    { name: "ROLE", uid: "role" },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
    admin: "success",
};

export default function Users() {
    const handleUserRoleChange = (id: string, role: string) => {
        fetch('/api/admin/change-user-role', {
            method: "post",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id, role
            })
        });
    }
    const renderCell = React.useCallback((user: IUser, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg" }}
                        description={user.username}
                        name={cellValue}>
                        {user.username}
                    </User>
                );
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{user.email}</p>
                    </div>
                );
            case "role":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.type]} size="sm" variant="flat">
                        {user.type}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 text-black">
                        {user.type !== "admin" && <Tooltip isDisabled={me === user.id} content="Make this user admin">
                            <Button isDisabled={me === user.id} className="bg-black" onPress={() => handleUserRoleChange(user.id, 'admin')}><span className="text-sm rounded p-3 text-white flex space-between cursor-pointer active:opacity-50">
                                <ShieldCheckIcon className="w-[20px] mr-2" />{'Make Admin'}
                            </span></Button>
                        </Tooltip>}
                        {user.type === "admin" && <Tooltip isDisabled={me === user.id} content="Make this user regular shopper">
                            <Button isDisabled={me === user.id} onPress={() => handleUserRoleChange(user.id, 'user')}><span className="text-sm text-white flex space-between cursor-pointer active:opacity-50">
                                <ShieldCheckIcon className="w-[20px] mr-2" />{'Make normal user'}
                            </span></Button>
                        </Tooltip>}
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const [users, setUsers] = useState<IUser[]>([]);
    useEffect(() => {
        fetch('/api/admin/users').then(res => res.json()).then(r => setUsers(r.items));
    }, []);
    const me = useAccountState(state => state.account?.id);
    const router = useRouter();
    return (
        <>
            <div className="min-h-full">
                <div className={"bg-white relative"}>
                    <Sidebar embedded={false} />
                    <div className="sm:ml-[20rem]">
                        <Navbar />
                        <div className="pr-4">
                            <div className="grid grid-cols-1 max-w-7xl overflow-scroll -md:xl:grid-cols-2 gap-2">
                                <Table fullWidth shadow='none' disabledKeys={[me ?? ""]} aria-label="Example table with custom cells">
                                    <TableHeader columns={columns}>
                                        {(column) => (
                                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                                {column.name}
                                            </TableColumn>
                                        )}
                                    </TableHeader>
                                    <TableBody emptyContent={'No users found'} items={users ?? []}>
                                        {(item) => (
                                            <TableRow key={item.id}>
                                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="border-t-1"></div>
                            <div className='flex pt-4 max-w-7xl w-full pb-1 space-between'>
                                <div style={{ flexGrow: "1 1 auto", flex: 1 }} />
                                <Button onPress={() => router.push('/auth/onboard')}><PlusCircleIcon width={20} />{'Create New User'}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
