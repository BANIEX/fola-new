import { Timestamp } from "mongodb"
import { IProductCartItem } from "../products/product"

export interface IUserTokenClaims {
    id: string,
    type: "user" | "admin"
}
export interface IUser {
    username?: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    name?: string,
    number: string
    id: string,
    gender: string,
    _id?: string | any,
    cart: {
        products: Array<IProductCartItem>,
    },
    code?: string,
    codeExpiresAt?: number,
    signins: Array<{token: string, createdAt: Timestamp, device: string}>,
    orders: Array<string>,
    type?: 'user' | 'admin'
}