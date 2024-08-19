import type { NextApiRequest, NextApiResponse } from 'next'
import { LoremIpsum } from "lorem-ipsum";
const shortID = require("short-uuid")

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string }>) {
    const gltfModelUrls = [
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF/CesiumMilkTruck.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF/BoomBox.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Corset/glTF/Corset.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF/FlightHelmet.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ReciprocatingSaw/glTF/ReciprocatingSaw.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF/WaterBottle.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedMorphCube/glTF/AnimatedMorphCube.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MetalRoughSpheres/glTF/MetalRoughSpheres.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBoxWithAxes/glTF/BoomBoxWithAxes.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF/BrainStem.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF/Lantern.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Spider/glTF/Spider.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF/BoomBox.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MetalRoughSpheres/glTF/MetalRoughSpheres.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF/AntiqueCamera.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ReciprocatingSaw/glTF/ReciprocatingSaw.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedMorphCube/glTF/AnimatedMorphCube.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF/FlightHelmet.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ReciprocatingSaw/glTF/ReciprocatingSaw.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF/WaterBottle.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF/AntiqueCamera.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Corset/glTF/Corset.gltf',
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf',
      ];
      
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
    });
    for (const i of (new Array(5))) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NmM1ODBhLWNiMzktNDkyYS1iM2QwLTY0MWRhMTgxYzcwNCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzA4MTExNTI3LCJleHAiOjE3MDk0MDc1Mjd9.AJNwTJ9FoQsepcz59lQB74T6yc8AJplzNuEUbEKTsKkH1EX_otO0sKLb8e-qU8Aak5nv86DmOXC9iM_aIRwVTlNZAafynI2yH4Y4yl2iiK5Y8dS-4x3Ib5ZSww1FgTnr9vU_VjvfpT-Tf38zB9mdgIya1oy0hjFgDFBUD1DqUHyJcKLP");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "auth.user=eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NmM1ODBhLWNiMzktNDkyYS1iM2QwLTY0MWRhMTgxYzcwNCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzA4MTExNTI3LCJleHAiOjE3MDk0MDc1Mjd9.AJNwTJ9FoQsepcz59lQB74T6yc8AJplzNuEUbEKTsKkH1EX_otO0sKLb8e-qU8Aak5nv86DmOXC9iM_aIRwVTlNZAafynI2yH4Y4yl2iiK5Y8dS-4x3Ib5ZSww1FgTnr9vU_VjvfpT-Tf38zB9mdgIya1oy0hjFgDFBUD1DqUHyJcKLP");
        var raw = JSON.stringify({
            "name": lorem.generateSentences(1),
            "price": {
                "code": process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? "",
                "value": Math.floor(Math.random() * 100)
            },
            "description": lorem.generateParagraphs(4),
            "variants": {
                "default": "76850555",
                "items": [{
                    "id": "76850555",
                    "priceModifier": "product.price.value + (variant.index == 0 ? 10 : 5) * 20",
                    "name": lorem.generateWords(Math.floor(Math.random() * 10)),
                    "model": {
                        "src": gltfModelUrls[Math.floor(Math.random()*gltfModelUrls.length)],
                        "type": "gltf"
                    },
                    "images": [
                        {
                            "src": "https://source.unsplash.com/collection/345710/200x200"
                        },
                        {
                            "src": "https://source.unsplash.com/collection/345710/200x200"
                        },
                        {
                            "src": "https://source.unsplash.com/collection/345710"
                        },
                        {
                            "src": "https://source.unsplash.com/collection/345710"
                        },
                    ]
                }, ...(Array.apply(null, Array(Math.floor(Math.random() * 10))).map(() => ({
                    "id": shortID.generate(),
                    "priceModifier": `product.price.value + (variant.index == 0 ? 10 : 5) * ${Math.random() * 100}`,
                    "name": lorem.generateWords(Math.floor(Math.random() * 10)),
                    "model": {
                        "src": gltfModelUrls[Math.floor(Math.random()*gltfModelUrls.length)],
                        "type": "gltf"
                    },
                    "images": [
                        {
                            "src": "https://source.unsplash.com/collection/345710/200x200"
                        },
                        {
                            "src": "https://source.unsplash.com/collection/345710/200x200"
                        },
                        {
                            "src": "https://source.unsplash.com/collection/345710"
                        },
                        {
                            "src": "https://source.unsplash.com/collection/345710"
                        },
                    ]
                })))]
            },
            "options": [
                {
                    "name": "Size",
                    "type": "select",
                    "option": {
                        "priceModifier": "product.price.value + (selection.index == 0 ? 5 : selection.index == 1 ? 8 : selection.index == 2 : 6) * 40",
                        "type": "string",
                        "defaultValue": 0,
                        "options": [
                            "Small",
                            "Medium",
                            "Large"
                        ]
                    }
                }
            ]
        });
    
        fetch("http://localhost:3000/api/product/create", {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    
    }
    res.json({ status: "valid", description: "" });
}