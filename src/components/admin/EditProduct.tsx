import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, Textarea } from "@nextui-org/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import sampleProduct from "./sample-product";
import { withEditProduct } from "./product-editor-config";
import { useProductEditorDialogState, useProductEditorState } from "@/zustand/page";
import { useSnackbar } from "notistack";
import UploadWidget from "../UploadWidget";


const JSONEditor = dynamic(() => import('@/components/VisualJSONEditor'), { ssr: false });
const ProductForm = () => {
    const { data, onDataChange } = useProductEditorState();
    return <JSONEditor onDataChange={onDataChange} data={data ?? {}} schema={withEditProduct(data.id) ?? {}} />;
}
export default function EditProduct() {
    const { open, toggleOpen } = useProductEditorDialogState();
    const matches = useMediaQuery('(min-width:600px)');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return (
        <Modal
            disableAnimation={true} fullWidth={true}
            scrollBehavior="outside"
            isOpen={open} isDismissable={false} size={!matches ? "full" : "5xl"}
            onOpenChange={console.log}
            hideCloseButton={true}
            placement="top">
            <ModalContent>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = useProductEditorState.getState();
                    console.log(data)
                    fetch("/api/product/update", {
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
                    enqueueSnackbar('Product updated successfully');
                    data.onDataChange({});
                    toggleOpen(false);
                }}>
                    <ModalHeader className="flex flex-col text-black pt-5 gap-1">Modifing {useProductEditorState?.getState()?.data?.id ?? "product"}</ModalHeader>
                    <ModalBody className="bg-white">
                        <div className="grid overflow-y-scroll grid-cols-1 -overflow-scroll h-full bg-white relative md:grid-cols-2 grid-gap-2">
                            <div>
                                <ProductForm />
                            </div>
                            <div className="h-max">
                                <UploadWidget />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={(e) => {
                            console.log("cleanup")
                            useProductEditorState?.getState()?.onDataChange(sampleProduct);
                            toggleOpen(false);
                        }}>
                            Discard
                        </Button>
                        <Button color="primary" type="submit">
                            Update
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
