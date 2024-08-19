import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAccountState } from "@/zustand/account";
import { useCartState, useProductState } from "@/zustand/product";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
export const AddToCart = () => {
    // const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const productName = useProductState(state => state.product?.name);
    const productId = useProductState(state => state.product?.id);
    const account = useAccountState(state => state.account);
    const variant = useProductState(state => state.variant);
    const serialize = useCartState(state => state.serialize);
    const matches = useMediaQuery('(min-width:600px)');
    const router = useRouter();
    const pathname = usePathname();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return (
        <>
            <button
                onClick={async () => {
                    if (account) {
                        const res = await fetch('/api/cart/add', {
                            method: "post",
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify([{
                                "id": productId, // Product ID forign key
                                ...serialize()
                            }])
                        });
                        if (res.ok) {
                            enqueueSnackbar(productName + ' added successfully to cart', {
                                autoHideDuration: 10000,
                                action: (key) => (
                                    <div className="flex flex-y gap-2">
                                        <Button variant="light" onPress={() => router.push('/cart')}>
                                            <div style={{ color: "white" }}>View Cart</div>
                                        </Button>
                                        <Button isIconOnly variant="light" onPress={() => closeSnackbar()}>
                                            <div style={{ color: "white", width: '1rem', height: '1rem' }}><XMarkIcon /></div>
                                        </Button>
                                    </div>
                                )
                            });
                        } else enqueueSnackbar(`An unhandled error occurred (${res.text()})`);
                    } else router.push('/auth/login?r=' + pathname);
                }}
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-[color:var(--primary-color)] px-8 py-3 text-base font-medium text-white hover:bg-[color:var(--primary-color-2)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:ring-offset-2">
                Add to cart
            </button>
            {/* <Modal placement="center" size={!matches ? "full" : "5xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent className="text-black">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{productName} added to cart</ModalHeader>
                            <ModalBody>
                                <p>
                                    {productName} - variant: {variant?.name ?? variant?.id} has been added to cart.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="default" variant="light" onPress={() => {
                                    router.push('/cart');
                                    onClose();
                                }}>
                                    View Cart
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal> */}
        </>
    )
}