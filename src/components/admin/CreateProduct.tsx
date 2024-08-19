import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Textarea } from "@nextui-org/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import JSONEditor from "@/components/VisualJSONEditor";
import { CircleStackIcon, HomeIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { create } from "zustand";
import sampleProduct from "./sample-product";
import productEditorConfig from "./product-editor-config";
import UploadWidget from "../UploadWidget";


export const useProductCreatorDialogState = create((set, get) => ({
    open: false,
    toggleOpen: (o: boolean) => set(state => ({ open: o ?? !state.open })),
}))
export const useProductCreatorState = create((set, get) => ({
    data: sampleProduct,
    onDataChange: (newData: object) => set({ data: newData }),
}))
const ProductForm = () => {
    const state = useProductCreatorState();
    return <JSONEditor onDataChange={state.onDataChange} data={state.data} schema={productEditorConfig} />;
}
export default function CreateProduct() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const matches = useMediaQuery('(min-width:600px)');
    return (
        <>
            <Listbox>
                <ListboxSection title="Actions">
                    <ListboxItem onClick={() => onOpen()}
                        startContent={<PlusIcon className={"text-xl text-default-500 pointer-events-none w-[20px] h-[20px] flex-shrink-0"} />} key="add-product">
                        Add Product
                    </ListboxItem>
                </ListboxSection>
            </Listbox>
            <Modal
                scrollBehavior="outside"
                disableAnimation={true}
                isOpen={isOpen} isDismissable={false} size={!matches ? "full" : "5xl"}
                onOpenChange={onOpenChange}
                hideCloseButton={true}
                placement="top">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const data = useProductCreatorState.getState();
                            fetch("/api/product/create", {
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
                            data.onDataChange(sampleProduct);
                            onClose();
                        }}>
                            <ModalHeader className="flex flex-col text-black pt-5 gap-1">Create a new product</ModalHeader>
                            <ModalBody>
                                <div className="grid overflow-y-scroll grid-cols-1 overflow-scroll h-max relative md:grid-cols-2 grid-gap-2">
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
                                    useProductCreatorState?.getState()?.onDataChange(sampleProduct);
                                    onClose(e);
                                }}>
                                    Discard
                                </Button>
                                <Button color="primary" type="submit">
                                    Save
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
