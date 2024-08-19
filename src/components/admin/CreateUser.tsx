import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, Textarea } from "@nextui-org/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import { useUserCreatorDialog, useUserCreatorState } from "@/zustand/page";
import { useSnackbar } from "notistack";


const JSONEditor = dynamic(() => import('@/components/VisualJSONEditor'), { ssr: false });
const ProductForm = () => {
    const { data, onDataChange } = useUserCreatorState();
    return <JSONEditor onDataChange={onDataChange} data={data ?? {}} schema={{
        "username": {
            type: "string", InputProps: {
                placeholder: "johndoe110",
                description: "Enter user's username",
                label: "Username",
                autoFocus: false,
                isRequired: true,
                variant: "flat"
            }, mutateable: true, value: ""
        },
        "email": {
            type: "string", InputProps: {
                placeholder: "john@doe.com",
                description: "Enter user's email addres",
                label: "Email",
                type: "email",
                autoFocus: false,
                isRequired: true,
                variant: "flat"
            }, mutateable: true, value: ""
        },
        "type": {
            type: "string", InputProps: {
                placeholder: "admin",
                description: "Uer's role e.g: 'admin' or 'user'",
                label: "Role",
                type: "text",
                autoFocus: false,
                isRequired: true,
                variant: "flat"
            }, mutateable: true, value: "admin"
        },
        "password": {
            type: "string", InputProps: {
                placeholder: "",
                description: "Enter user's password",
                label: "Password",
                autoFocus: false,
                type: "password",
                isRequired: true,
                variant: "flat"
            }, mutateable: true, value: ""
        },
    }} />;
}
export default function CreateUser() {
    const { open, toggleOpen } = useUserCreatorDialog();
    const matches = useMediaQuery('(min-width:600px)');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return (
        <Modal
            disableAnimation={true} fullWidth
            scrollBehavior="outside"
            isOpen={open} isDismissable={false} size={!matches ? "full" : "5xl"}
            onOpenChange={console.log}
            hideCloseButton={true}
            placement="top">
            <ModalContent>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = useUserCreatorState.getState();
                    console.log(data)
                    fetch("/api/admin/create-user", {
                        method: "POST",
                        headers: {
                            'content-type': "application/json"
                        },
                        body: JSON.stringify(data.data),
                        credentials: "include"
                    })
                        .then((response) => response.json())
                        .then((result) => console.log(result))
                        .catch((error) => console.error(error));
                    enqueueSnackbar('User updated successfully');
                    data.onDataChange({});
                    toggleOpen(false);
                }}>
                    <ModalHeader className="flex flex-col text-black pt-5 gap-1">Create new user role</ModalHeader>
                    <ModalBody>
                        <div className="overflow-scroll h-max relative">
                            <ProductForm />
                            <div className="hidden flex py-2 px-1 justify-between">
                                <Checkbox
                                    classNames={{
                                        label: "text-small",
                                    }}>
                                    Remember me
                                </Checkbox>
                                <Link color="primary" href="#" size="sm">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={(e) => {
                            console.log("cleanup")
                            useUserCreatorState?.getState()?.onDataChange({});
                            toggleOpen(false);
                        }}>
                            Discard
                        </Button>
                        <Button color="primary" type="submit">
                            Create
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
