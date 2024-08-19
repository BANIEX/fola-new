export default {
    "name": "Sample product",
    "price": {
        "code": process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? "",
        "value": 1
    },
    "description": "Sample product description",
    "variants": {
        "default": "0",
        "items": [
            {
                "id": "0",
                "priceModifier": "product.price.value + 0",
                "name": "Variant 1",
                "model": {
                    "src": "https://docs.cloud.kabeers.network/tests/work/3d-ecom/models/apple-watch/scene.gltf",
                    "type": "gltf"
                },
                "images": [
                    {
                        "src": "https://d2j6dbq0eux0bg.cloudfront.net/images/17021185/4090372679.png"
                    }
                ]
            }
        ]
    },
    "options": [
        {
            "name":"Color",
            "type":"color-select",
            "option":{
               "priceModifier":"product.price.value + (selection.index === 0 ? 5 : selection.index === 1 ? 8 : selection.index === 2 : 6) * 40",
               "type":"string",
               "defaultValue":"#000000",
               "options": [
                  "#000000",
                  "#FAFAFA",
                  "#EEEEEE"
               ]
            },
            "material":"*",
            "id":"base-color"
         },
         {
             "name":"Size",
             "type":"select",
             "option":{
                "priceModifier":"product.price.value",
                "type":"string",
                "defaultValue":"M",
                "options": [
                   "S",
                   "M",
                   "L"
                ]
             },
             "material":"*",
             "id":"size"
          }
    ]
}