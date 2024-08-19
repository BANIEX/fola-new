import { ObjectId } from "mongodb";
import { IProductCartItem } from "../products/product";
import { ReactNode } from "react";

export interface ICart {
    total: ReactNode;
    _id?: ObjectId,
    id: string,
    owner: string, // Owner userId
    items: Array<IProductCartItem>,
    createdAt: Date,
    anonymous?: {
        temporaryId: string
    }
}
export interface IOrder {
    _id?: ObjectId,
    id: string,
    owner: string, // Owner userId
    items: Array<IProductCartItem>,
    createdAt: Date,
    modifiedAt: Date,
    billing: {
        address: string,
        postalCode: number
    },
    total: number,
    payment: {
        confirmed: boolean,
        type: "cod"
    },
    status: "delivered" | "recieved" | "out-for-shipping"
}