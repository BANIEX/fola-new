import { ObjectId } from "mongodb";
export type IVariantImage = { src: string, width?: number, height?: number, variant?: "xl" | "lg" | "md" | "sm" | "xs" }
export type IPriceModifier = string | number;
export interface IVariant {
    id: string,
    name?: string,
    priceModifier: IPriceModifier, // -+ N
    model: {
        src: string,
        type: "gltf" | "obj",
    },
    images: Array<IVariantImage>,
};
export interface IOptionNumber {
    defaultValue: number,
    range: [number, number],
    priceModifier: IPriceModifier, // -+ N
}
export interface IOptionText {
    defaultValue: string,
    length?: number,
    priceModifier: IPriceModifier, // -+ N
}
export interface IOptionSelectNumber {
    type: "numerical",
    defaultValue: number, // Index
    priceModifier: IPriceModifier, // -+ N * Index
    options: Array<number>,
}
export interface IOptionSelectString {
    type: "string",
    defaultValue: number, // Index
    material?: "*" | string,
    priceModifier: IPriceModifier, // -+ N
    options: Array<string>,
}
export interface IOption {
    material: string;
    id: string,
    name: string,
    type: "number" | "select" | "color-select" | "text",
    option: IOptionText | IOptionNumber | IOptionSelectNumber | IOptionSelectString
}
export interface IProductCartItem {
    id: string, // Product ID forign key
    product?: IProduct,
    [x: string]: any,
    configuration: {
        variant: { id: string, selected: boolean },
        options: Array<{ id: string, value: string | number }>,
    }
}
export interface IProductPrice {
    value: number,
    code:   "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" |
    "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BRL" |
    "BSD" | "BTN" | "BWP" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLP" | "CNY" |
    "COP" | "CRC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" |
    "ERN" | "ETB" | "EUR" | "FJD" | "FKP" | "FOK" | "GBP" | "GEL" | "GGP" | "GHS" |
    "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" |
    "IDR" | "ILS" | "IMP" | "INR" | "IQD" | "IRR" | "ISK" | "JEP" | "JMD" | "JOD" |
    "JPY" | "KES" | "KGS" | "KHR" | "KID" | "KIN" | "KRW" | "KWD" | "KYD" | "KZT" |
    "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" |
    "MMK" | "MNT" | "MOP" | "MRU" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "MZN" |
    "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" |
    "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" |
    "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLL" | "SOS" | "SRD" | "SSP" |
    "STN" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" |
    "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "UYU" | "UZS" | "VES" | "VND" | "VUV" |
    "WST" | "XAF" | "XCD" | "XDR" | "XOF" | "XPF" | "YER" | "ZAR" | "ZMW" | "ZWL" | "AZN"
}
export interface IProduct {
    _id?: ObjectId | string | undefined,
    id: string,
    slug: string,
    name: string,
    description: string,
    variants: {
        default: string,
        items: Array<IVariant>
    },
    price: IProductPrice,
    options: Array<IOption>,
    metadata: {
        [x: string]: any,
        deleted?: true | boolean,
        stock?: 'in-stock' | 'out-of-stock'
        reviews: {
            type: "embedded.disqus"
        },
        orders?: {
            count: number,
            lastUpdated: Date,
        }
    }
};
export interface IReview {
    _id: {
        $oid: string;
    };
    id: string;
    product_id: string;
    author: string;
    rating: number;
}