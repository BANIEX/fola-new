import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, Textarea } from "@nextui-org/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import { withViewProduct } from "./product-editor-config";
import { useProductViewDialogState, useProductViewState } from "@/zustand/page";


const JSONEditor = dynamic(() => import('@/components/VisualJSONEditor'), { ssr: false });
const ProductForm = () => {
    const { data } = useProductViewState();
    return <JSONEditor onDataChange={() => { }} data={data ?? {}} schema={withViewProduct(data.id) ?? {}} />;
}
export default function ViewProduct() {
    const { open, toggleOpen } = useProductViewDialogState();
    const matches = useMediaQuery('(min-width:600px)');
    return (
        <Modal
            disableAnimation={true} fullWidth={true}
            scrollBehavior="outside"
            isOpen={open} isDismissable={false} size={!matches ? "full" : "5xl"}
            onOpenChange={console.log}
            hideCloseButton={true}
            placement="top">
            <ModalContent>
                <ModalHeader className="flex flex-col text-black pt-5 gap-1"></ModalHeader>
                <ModalBody>
                    <div className="overflow-scroll h-max relative">
                        <ProductForm />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={(e) => toggleOpen(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
