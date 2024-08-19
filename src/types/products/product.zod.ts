import { z } from "zod"

export const iVariantImageSchema = z.object({
  src: z.string(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
  variant: z
    .union([
      z.literal("xl"),
      z.literal("lg"),
      z.literal("md"),
      z.literal("sm"),
      z.literal("xs")
    ])
    .optional()
})

export const iPriceModifierSchema = z.union([z.string(), z.number()])

export const iVariantSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  priceModifier: iPriceModifierSchema,
  model: z.object({
    src: z.string(),
    type: z.union([z.literal("gltf"), z.literal("obj")])
  }),
  images: z.array(iVariantImageSchema)
})

export const iOptionNumberSchema = z.object({
  defaultValue: z.number(),
  range: z.tuple([z.number(), z.number()]),
  priceModifier: iPriceModifierSchema
})

export const iOptionTextSchema = z.object({
  defaultValue: z.string(),
  length: z.number().optional(),
  priceModifier: iPriceModifierSchema
})

export const iOptionSelectNumberSchema = z.object({
  type: z.literal("numerical"),
  defaultValue: z.number(),
  priceModifier: iPriceModifierSchema,
  options: z.array(z.number())
})

export const iOptionSelectStringSchema = z.object({
  type: z.literal("string"),
  defaultValue: z.union([z.number(), z.string()]),
  priceModifier: iPriceModifierSchema,
  options: z.array(z.string())
})

export const iOptionSchema = z.object({
  name: z.string(),
  type: z.union([z.literal("number"), z.literal("select"), z.literal("text"), z.literal("color-select")]),
  option: z.union([
    iOptionTextSchema,
    iOptionNumberSchema,
    iOptionSelectNumberSchema,
    iOptionSelectStringSchema
  ])
})

export const iProductCartItemSchema = z.object({
  id: z.string(),
  configuration: z.object({
    variant: z.object({
      id: z.string(),
      selected: z.boolean()
    }),
    options: z.array(
      z.object({
        id: z.string(),
        value: z.union([z.string(), z.number()])
      })
    )
  })
})

export const iProductPriceSchema = z.object({
  value: z.number(),
  code: z.union([
    z.literal("AED"),
    z.literal("AFN"),
    z.literal("ALL"),
    z.literal("AMD"),
    z.literal("ANG"),
    z.literal("AOA"),
    z.literal("ARS"),
    z.literal("AUD"),
    z.literal("AWG"),
    z.literal("BAM"),
    z.literal("BBD"),
    z.literal("BDT"),
    z.literal("BGN"),
    z.literal("BHD"),
    z.literal("BIF"),
    z.literal("BMD"),
    z.literal("BND"),
    z.literal("BOB"),
    z.literal("BRL"),
    z.literal("BSD"),
    z.literal("BTN"),
    z.literal("BWP"),
    z.literal("BYN"),
    z.literal("BZD"),
    z.literal("CAD"),
    z.literal("CDF"),
    z.literal("CHF"),
    z.literal("CLP"),
    z.literal("CNY"),
    z.literal("COP"),
    z.literal("CRC"),
    z.literal("CUP"),
    z.literal("CVE"),
    z.literal("CZK"),
    z.literal("DJF"),
    z.literal("DKK"),
    z.literal("DOP"),
    z.literal("DZD"),
    z.literal("EGP"),
    z.literal("ERN"),
    z.literal("ETB"),
    z.literal("EUR"),
    z.literal("FJD"),
    z.literal("FKP"),
    z.literal("FOK"),
    z.literal("GBP"),
    z.literal("GEL"),
    z.literal("GGP"),
    z.literal("GHS"),
    z.literal("GIP"),
    z.literal("GMD"),
    z.literal("GNF"),
    z.literal("GTQ"),
    z.literal("GYD"),
    z.literal("HKD"),
    z.literal("HNL"),
    z.literal("HRK"),
    z.literal("HTG"),
    z.literal("HUF"),
    z.literal("IDR"),
    z.literal("ILS"),
    z.literal("IMP"),
    z.literal("INR"),
    z.literal("IQD"),
    z.literal("IRR"),
    z.literal("ISK"),
    z.literal("JEP"),
    z.literal("JMD"),
    z.literal("JOD"),
    z.literal("JPY"),
    z.literal("KES"),
    z.literal("KGS"),
    z.literal("KHR"),
    z.literal("KID"),
    z.literal("KIN"),
    z.literal("KRW"),
    z.literal("KWD"),
    z.literal("KYD"),
    z.literal("KZT"),
    z.literal("LAK"),
    z.literal("LBP"),
    z.literal("LKR"),
    z.literal("LRD"),
    z.literal("LSL"),
    z.literal("LYD"),
    z.literal("MAD"),
    z.literal("MDL"),
    z.literal("MGA"),
    z.literal("MKD"),
    z.literal("MMK"),
    z.literal("MNT"),
    z.literal("MOP"),
    z.literal("MRU"),
    z.literal("MUR"),
    z.literal("MVR"),
    z.literal("MWK"),
    z.literal("MXN"),
    z.literal("MYR"),
    z.literal("MZN"),
    z.literal("NAD"),
    z.literal("NGN"),
    z.literal("NIO"),
    z.literal("NOK"),
    z.literal("NPR"),
    z.literal("NZD"),
    z.literal("OMR"),
    z.literal("PAB"),
    z.literal("PEN"),
    z.literal("PGK"),
    z.literal("PHP"),
    z.literal("PKR"),
    z.literal("PLN"),
    z.literal("PYG"),
    z.literal("QAR"),
    z.literal("RON"),
    z.literal("RSD"),
    z.literal("RUB"),
    z.literal("RWF"),
    z.literal("SAR"),
    z.literal("SBD"),
    z.literal("SCR"),
    z.literal("SDG"),
    z.literal("SEK"),
    z.literal("SGD"),
    z.literal("SHP"),
    z.literal("SLL"),
    z.literal("SOS"),
    z.literal("SRD"),
    z.literal("SSP"),
    z.literal("STN"),
    z.literal("SYP"),
    z.literal("SZL"),
    z.literal("THB"),
    z.literal("TJS"),
    z.literal("TMT"),
    z.literal("TND"),
    z.literal("TOP"),
    z.literal("TRY"),
    z.literal("TTD"),
    z.literal("TWD"),
    z.literal("TZS"),
    z.literal("UAH"),
    z.literal("UGX"),
    z.literal("USD"),
    z.literal("UYU"),
    z.literal("UZS"),
    z.literal("VES"),
    z.literal("VND"),
    z.literal("VUV"),
    z.literal("WST"),
    z.literal("XAF"),
    z.literal("XCD"),
    z.literal("XDR"),
    z.literal("XOF"),
    z.literal("XPF"),
    z.literal("YER"),
    z.literal("ZAR"),
    z.literal("ZMW"),
    z.literal("ZWL"),
    z.literal("AZN")
  ])
})

export const iProductSchemaZod = z.object({
  _id: z.union([z.string(), z.undefined()]).optional(),
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  variants: z.object({
    default: z.string(),
    items: z.array(iVariantSchema)
  }),
  price: iProductPriceSchema,
  options: z.array(iOptionSchema),
  metadata: z.record(z.any()).and(
    z.object({
      deleted: z.union([z.literal(true), z.boolean()]).optional(),
      reviews: z.object({
        type: z.literal("embedded.disqus")
      }),
      orders: z
        .object({
          count: z.number(),
          lastUpdated: z.union([z.date(), z.string()])
        })
        .optional()
    })
  )
})
