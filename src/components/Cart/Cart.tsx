import { ICart, IOrder } from '@/types/cart/cart';
import { Button, Chip, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea, useDisclosure } from '@nextui-org/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

import { loadStripe } from "@stripe/stripe-js";
import ReactTimeago from 'react-timeago';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { enqueueSnackbar, useSnackbar } from 'notistack';





export const CartElement = ({ cart: data, onItemRemoval, heading = 'Shopping cart', order = false }: { order?: boolean, onItemRemoval: (d: IOrder[]) => any, heading?: string, cart: ICart }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [address, setAddress] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const matches = useMediaQuery('(min-width:600px)');
  const [phone, setPhone] = useState();
  const [postalCode, setPostalCode] = useState();




  const handleItemRemoval = (index: number) => {
    fetch('/api/cart/remove-item', {
      method: "post",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ index: index })
    });
    onItemRemoval(data.items.filter((_, i) => i !== index));
  }


  
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
  const stripePromise = loadStripe(publishableKey);
  const createCheckOutSession = async (id: string) => {
    const stripe = await stripePromise;
    const checkoutSession = await fetch("/api/create-stripe-session", {
      body: JSON.stringify({
        id
      }),
      method: 'post',
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.json()) as { id: string };
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    if (result?.error) alert(result?.error.message);
  };











  return (
    <div className={`flex h-full flex-col overflow-y-scroll bg-white ${!data?.items?.length && 'hidden'}`}>
      <div className={`flex-1 overflow-y-auto px-4 py-6 sm:px-6`}>
        <div className="flex flex-col items-start justify-between">
          <h2 className="text-lg font-large text-gray-900">{heading}</h2>
        </div>
        <div className="mt-4">
          <div className="flow-root">
            <ul role="list" className="my-6 divide-y divide-gray-200">
              {data && data?.items?.map((cartItem, index) => {
                const selectedVariant = cartItem.product?.variants.items.find(a => a.id === cartItem.configuration.variant.id);
                return (
                  <li key={`${cartItem.id}-${index}`} className="flex items-center py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedVariant?.images[0].src}
                        alt={cartItem.product?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="font-large">
                            <a href={`/product/${cartItem?.product?.slug}`}>{cartItem?.product?.name}</a>
                            <p className="text-gray-500">{selectedVariant?.name}</p>
                          </h3>
                          <p className="ml-4">{process.env.NEXT_PUBLIC_CURRENCY_SIGN.toString()}{cartItem.total.toFixed(2)}</p>
                        </div>
                        <Listbox className="p-2 bg-gray-100 border mt-4 rounded">
                          {cartItem.configuration.options.map(({ id, value }) => {
                            const option = cartItem?.product?.options?.find(a => a.id === id);
                            return (
                              <ListboxItem key={id} className="px-0">
                                <div className="flex gap-2 items-center px-4">
                                  <strong>{option?.name}</strong>: {option?.type === "color-select" ? <div className="w-[1.5rem] h-[1.5rem] rounded-full" style={{ backgroundColor: value }} /> : value}
                                </div>
                              </ListboxItem>
                            )
                          })}
                        </Listbox>
                      </div>
                      <div className="flex flex-1 mt-4 h-idden items-end justify-between text-sm">
                        <div className="flex">
                          <button onClick={() => handleItemRemoval(index)}
                            type="button"
                            className="font-medium text-black hover:text-gray-900">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <>
        <form 
        onSubmit={async e => {
          e.preventDefault();
          const { id } = await fetch('/api/cart/order', {
            method: 'post',
            body: JSON.stringify({
              cart: data.id, // Cart ID,
              address,
              phone,
              postalCode
            }),
            headers: { 'content-type': 'application/json' }
          }).then(res => res.json());
          if (matches) onOpen();
          if (!matches) enqueueSnackbar(<div className='flex gap-2'><Spinner color="default" size="sm" /> {' Redirecting to payment'}</div>, { persist: true })
          onItemRemoval([]);
          await createCheckOutSession(id);
        }}
         className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{process.env.NEXT_PUBLIC_CURRENCY_SIGN.toString()}{data?.total?.toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          <div className="flex gap-2 mt-6">
            <div className='w-full'>
              <Textarea className="max-w-md" minRows={5} isRequired={true} onChange={e => setAddress(e.target.value)} value={address} required description="Enter your street address and city" type="text" placeholder="Address" />
              <Input className="max-w-[20rem]" isRequired={true} onChange={e => setPhone(e.target.value)} value={phone} required description="Enter your phone number" type="number" placeholder="Phone Number" />
            </div>
            <div style={{ flexGrow: '1 1 auto', flex: 1 }} />
            <div>
              <Input isRequired={true} onChange={e => setPostalCode(e.target.value)} value={postalCode} required description="Enter your postalcode" type="text" placeholder="Postal Code" />
              <Select
                isRequired={true}
                label="State"
                placeholder="Select a state"
                className="max-w-xs">
                {[
                  "Brighton and hove",
                  "Birmingham",
                  "Bristol",
                  "Coventry",
                  "London",
                  "Leeds",
                  "Leicester",
                  "Manchester",
                  "Plymouth",
                ].map((state) => (
                  <SelectItem className="text-black" key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900">
              Checkout
            </button>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{' '}
              <a
                href="/"
                type="button"
                className="font-medium text-black hover:text-gray-900"
                onClick={() => { }}>
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </form>
        <Modal placement="center" size={!matches ? "full" : "5xl"} isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-1 text-black">
                  <div className="flex gap-2" style={{ color: 'black' }}>
                    <Spinner style={{ color: 'black' }} className='mr-4' />
                    <p>Order Placed, Redirecting to payment</p>
                  </div>
                </ModalHeader>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button className="bg-black- -text-white" onPress={onClose} href='mailto:support@ranforte.com' target="_blank">
                    Contact Support
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  )
}







export const OrderElement = ({ order: data, admin, heading = 'Shopping cart' }: { heading?: string, admin?: boolean, order: IOrder }) => {

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
  const stripePromise = loadStripe(publishableKey);
  const createCheckOutSession = async (id: string) => {
    const stripe = await stripePromise;
    const checkoutSession = await fetch("/api/create-stripe-session", {
      body: JSON.stringify({
        id
      }),
      method: 'post',
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.json()) as { id: string };
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    if (result?.error) alert(result?.error.message);
  };

  return (
    <div className={`flex h-full flex-col overflow-y-scroll bg-white ${!data?.items?.length && 'hidden'}`}>
      <div className={`flex-1 overflow-y-auto px-4 py-6 sm:px-6 border rounded ${data.payment.confirmed ? '' : 'border-rose-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start justify-between">
            <h2 className="text-lg font-large text-gray-900">{heading} — {data.payment.confirmed ? 'Payment Confirmed' : 'Payment pending'}</h2>
            <p className="text-gray-400">Order ID: {data.id} — Created <ReactTimeago date={data.createdAt} /></p>
            <p className="text-gray-400">{data.billing.address} — Postal: {data.billing.postalCode}</p>
          </div>
          {(!data.payment.confirmed && !admin) && <div>
            <Button color='danger' onClick={() => createCheckOutSession(data.id)}>Pay Now</Button>
          </div>}
        </div>
        <div className="mt-4">
          <div className="flow-root">
            <ul role="list" className="my-6 divide-y divide-gray-200">
              {data && data?.items?.map((cartItem, index) => {
                const selectedVariant = cartItem.product?.variants.items.find(a => a.id === cartItem.configuration.variant.id);
                return (
                  <li key={`${cartItem.id}-${index}`} className="flex items-center py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedVariant?.images[0].src}
                        alt={cartItem.product?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="font-large">
                            <a href={`/product/${cartItem?.product?.slug}`}>{cartItem?.product?.name}</a>
                            <p className="text-gray-500">{selectedVariant?.name}</p>
                          </h3>
                          <p className="ml-4">{process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString()}{cartItem.total.toFixed(2)}</p>
                        </div>
                        <Listbox className="p-2 bg-gray-100 border mt-4 rounded">
                          {cartItem.configuration.options.map(({ id, value }) => {
                            const option = cartItem?.product?.options?.find(a => a.id === id);
                            return (
                              <ListboxItem key={id} className="px-0">
                                <div className="flex gap-2 items-center px-4">
                                  <strong>{option?.name}</strong>: {option?.type === "color-select" ? <div className="w-[1.5rem] h-[1.5rem] rounded-full" style={{ backgroundColor: value }} /> : value}
                                </div>
                              </ListboxItem>
                            )
                          })}
                        </Listbox>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            Total: {process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString()}{data.total.toFixed(2)}
          </div>
          {/* <Chip>{data.payment.type.toUpperCase()}</Chip> */}
          <div className="flex gap-3"><Chip>Order {data.status.toUpperCase()}</Chip></div>
        </div>
      </div>
    </div>
  )
}
