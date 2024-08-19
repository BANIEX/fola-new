const ProductConfig = {
    type: "object",
    mutateable: true,
    InputProps: {},
    value: {
        "name": {
            type: "string", InputProps: {
                placeholder: "Enter base product name",
                description: "Enter base product name",
                label: "Name",
                autoFocus: false,
                isRequired: true,
                variant: "flat"
            }, mutateable: true, value: ""
        },
        "slug": {
            type: "string", InputProps: {
                placeholder: "great-product-123",
                description: "Enter url slug, (has to be unique)",
                label: "Slug",
                autoFocus: false,
                isRequired: false,
                variant: "flat"
            }, mutateable: true, value: ""
        },
        "price": {
            type: "object",
            mutateable: true,
            InputProps: {},
            value: {
                "value": {
                    type: "number", InputProps: {
                        placeholder: "Enter base price for the product",
                        description: "Enter base price for the product",
                        label: "Price",
                        isRequired: true,
                        startContent: (
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">{process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString() ?? ""}</span>
                            </div>
                        ),
                        endContent: (
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">{process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? ""}</span>
                            </div>
                        ),
                        variant: "flat",
                    }, mutateable: true, value: 0.0
                },
                "code": {
                    type: "string", InputProps: {
                        placeholder: "Enter base Curency code for the product",
                        label: "Curency code",
                        isRequired: false,
                        variant: "flat",
                    }, mutateable: false, value: process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? ""
                }
            }
        },
        "description": {
            type: "big-string", InputProps: {
                placeholder: "Enter detailed product description",
                description: "Enter detailed product description",
                label: "Description",
                variant: "flat",
                isRequired: true,
            }, mutateable: true, value: ""
        },
        "options": {
            type: "array",
            InputProps: {},
            mutateable: true,
            value: {
                type: "object",
                mutateable: true,
                InputProps: {},
                value: {
                    "name": {
                        type: "string", InputProps: {
                            placeholder: "Enter option name",
                            description: "",
                            label: "Option Name",
                            variant: "flat",
                            isRequired: true,
                        }, mutateable: true, value: ""
                    },
                    "type": {
                        type: "string", InputProps: {
                            placeholder: "Enter option type: select, color-select",
                            description: "Enter option type: (selectable, color-select, string, number)",
                            label: "Option Type",
                            variant: "flat",
                            isRequired: true,
                        }, mutateable: true, value: "select"
                    },
                    "id": {
                        type: "string", InputProps: {
                            placeholder: "E.g. box color",
                            description: "Enter (sku/id) for this option, write `base-color` along with type `color-select` to make this option viewable in the model-viewer color system",
                            label: "SKU/ID",
                            variant: "flat",
                            isRequired: true,
                        }, mutateable: true, value: ""
                    },
                    "material": {
                        type: "string", InputProps: {
                            placeholder: "Model Material ID",
                            description: "ID for the model's material this option targets. `*` means all materials",
                            label: "Material (optional)",
                            variant: "flat",
                            isRequired: false,
                        }, mutateable: true, value: "*"
                    },
                    "option": {
                        type: "object",
                        mutateable: true,
                        InputProps: {},
                        value: {
                            "priceModifier": {
                                type: "string", InputProps: {
                                    placeholder: "product.price.value + (selection.index === 0 ? 5 : selection.index === 1 ? 8 : selection.index === 2 : 6) * 40",
                                    description: "Price modifier for this option",
                                    label: "Price Modifier",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: true, value: ""
                            },
                            "type": {
                                type: "string", InputProps: {
                                    placeholder: "string",
                                    description: "Data type for option",
                                    label: "Option data type",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: false, value: "string"
                            },
                            "defaultValue": {
                                type: "string", InputProps: {
                                    placeholder: "Enter default value for this option",
                                    description: "Enter default value for this option",
                                    label: "Default Value",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: true, value: ""
                            },
                            "options": {
                                type: "array",
                                debug: true,
                                InputProps: {},
                                mutateable: true,
                                value: {
                                    type: "string", InputProps: {
                                        placeholder: "Value for this option",
                                        description: "Enter value for this option",
                                        label: "Option Value",
                                        variant: "flat",
                                        isRequired: true,
                                    }, mutateable: true, value: ""
                                }
                            }
                        }
                    }
                }
            },
        },
        "variants": {
            type: "object",
            mutateable: true,
            InputProps: {},
            value: {
                "default": {
                    type: "string", InputProps: {
                        placeholder: "Enter variant number",
                        description: "Enter the Id of the variant you want to make default",
                        label: "Default Variant",
                        variant: "flat",
                        isRequired: true,
                    }, mutateable: true, value: "0"
                },
                "items": {
                    type: "array",
                    InputProps: {},
                    mutateable: true,
                    value: {
                        type: "object",
                        mutateable: true,
                        InputProps: {},
                        value: {
                            "id": {
                                type: "string", InputProps: {
                                    placeholder: "Id of this variant",
                                    label: "Variant Id",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: true, value: ""
                            },
                            "name": {
                                type: "string", InputProps: {
                                    placeholder: "Name of this variant",
                                    label: "Variant name",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: true, value: ""
                            },
                            "priceModifier": {
                                type: "string", InputProps: {
                                    placeholder: "Id of this variant",
                                    description: "Expresion to modify price for this variant",
                                    label: "Price Modifier",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: true, value: ""
                            },
                            "model": {
                                type: "object",
                                mutateable: true,
                                InputProps: {},
                                value: {
                                    "src": {
                                        type: "string", InputProps: {
                                            placeholder: "Source url for product model",
                                            description: "Product source url. Currently only GLTF/GLB models are supported",
                                            label: "Source",
                                            variant: "flat",
                                            isRequired: true,
                                        }, mutateable: true, value: ""
                                    },
                                    "type": {
                                        type: "string", InputProps: {
                                            placeholder: "gltf",
                                            label: "Model type",
                                            variant: "flat",
                                            isRequired: true,
                                        }, mutateable: false, value: "gltf"
                                    },
                                }
                            },
                            "images": {
                                type: "array",
                                mutateable: true,
                                InputProps: {},
                                value: {
                                    type: "object",
                                    mutateable: true,
                                    InputProps: {},
                                    value: {
                                        "src": {
                                            type: "string", InputProps: {
                                                placeholder: "Image source url",
                                                label: "Image source",
                                                variant: "flat",
                                                isRequired: true,
                                            }, mutateable: true, value: ""
                                        },
                                        "width": {
                                            type: "number", InputProps: {
                                                placeholder: "400px",
                                                label: "Image width",
                                                variant: "flat",
                                                isRequired: false,
                                            }, mutateable: true, value: ""
                                        },
                                        "height": {
                                            type: "number", InputProps: {
                                                placeholder: "400px",
                                                label: "Image height",
                                                variant: "flat",
                                                isRequired: false,
                                            }, mutateable: true, value: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
const withMutations = (mutateable: boolean) => ({
    type: "object",
    mutateable,
    InputProps: {},
    value: {
        "name": {
            type: "string", InputProps: {
                placeholder: "Enter base product name",
                description: "Enter base product name",
                label: "Name",
                autoFocus: false,
                isRequired: true,
                variant: "flat"
            }, mutateable, value: ""
        },
        "slug": {
            type: "string", InputProps: {
                placeholder: "great-product-123",
                description: "Enter url slug, (has to be unique)",
                label: "Slug",
                autoFocus: false,
                isRequired: false,
                variant: "flat"
            }, mutateable, value: ""
        },
        "price": {
            type: "object",
            mutateable,
            InputProps: {},
            value: {
                "value": {
                    type: "number", InputProps: {
                        placeholder: "Enter base price for the product",
                        description: "Enter base price for the product",
                        label: "Price",
                        isRequired: true,
                        startContent: (
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">{process.env.NEXT_PUBLIC_CURRENCY_SIGN?.toString() ?? ""}</span>
                            </div>
                        ),
                        endContent: (
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">{process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? ""}</span>
                            </div>
                        ),
                        variant: "flat",
                    }, mutateable, value: 0.0
                },
                "code": {
                    type: "string", InputProps: {
                        placeholder: "Enter base Curency code for the product",
                        label: "Curency code",
                        isRequired: false,
                        variant: "flat",
                    }, mutateable: false, value: process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? ""
                }
            }
        },
        "description": {
            type: "big-string", InputProps: {
                placeholder: "Enter detailed product description",
                description: "Enter detailed product description",
                label: "Description",
                variant: "flat",
                isRequired: true,
            }, mutateable, value: ""
        },
        "options": {
            type: "array",
            InputProps: {},
            mutateable,
            value: {
                type: "object",
                mutateable,
                InputProps: {},
                value: {
                    "name": {
                        type: "string", InputProps: {
                            placeholder: "Enter option name",
                            description: "",
                            label: "Option Name",
                            variant: "flat",
                            isRequired: true,
                        }, mutateable, value: ""
                    },
                    "type": {
                        type: "string", InputProps: {
                            placeholder: "Enter option type: select, color-select",
                            description: "Enter option type: (selectable, color-select, string, number)",
                            label: "Option Type",
                            variant: "flat",
                            isRequired: true,
                        }, mutateable, value: "select"
                    },
                    "id": {
                        type: "string", InputProps: {
                            placeholder: "E.g. box color",
                            description: "Enter (sku/id) for this option, write `base-color` along with type `color-select` to make this option viewable in the model-viewer color system",
                            label: "SKU/ID",
                            variant: "flat",
                            isRequired: true,
                        }, mutateable, value: ""
                    },
                    "material": {
                        type: "string", InputProps: {
                            placeholder: "Model Material ID",
                            description: "ID for the model's material this option targets. `*` means all materials",
                            label: "Material (optional)",
                            variant: "flat",
                            isRequired: false,
                        }, mutateable, value: "*"
                    },
                    "option": {
                        type: "object",
                        mutateable,
                        InputProps: {},
                        value: {
                            "priceModifier": {
                                type: "string", InputProps: {
                                    placeholder: "product.price.value + (selection.index === 0 ? 5 : selection.index === 1 ? 8 : selection.index === 2 : 6) * 40",
                                    description: "Price modifier for this option",
                                    label: "Price Modifier",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable, value: ""
                            },
                            "type": {
                                type: "string", InputProps: {
                                    placeholder: "string",
                                    description: "Data type for option",
                                    label: "Option data type",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable: false, value: "string"
                            },
                            "defaultValue": {
                                type: "string", InputProps: {
                                    placeholder: "Enter default value for this option",
                                    description: "Enter default value for this option",
                                    label: "Default Value",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable, value: ""
                            },
                            "options": {
                                name: "Add item to this option",
                                type: "array",
                                debug: true,
                                InputProps: {},
                                mutateable,
                                value: {
                                    type: "string", InputProps: {
                                        placeholder: "Value for this option",
                                        description: "Enter value for this option",
                                        label: "Option Value",
                                        variant: "flat",
                                        isRequired: true,
                                    }, mutateable, value: ""
                                }
                            }
                        }
                    }
                }
            },
        },
        "variants": {
            type: "object",
            mutateable,
            InputProps: {},
            value: {
                "default": {
                    type: "string", InputProps: {
                        placeholder: "Enter variant number",
                        description: "Enter the Id of the variant you want to make default",
                        label: "Default Variant",
                        variant: "flat",
                        isRequired: true,
                    }, mutateable, value: "0"
                },
                "items": {
                    type: "array",
                    InputProps: {},
                    mutateable,
                    value: {
                        type: "object",
                        mutateable,
                        InputProps: {},
                        value: {
                            "id": {
                                type: "string", InputProps: {
                                    placeholder: "Id of this variant",
                                    label: "Variant Id",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable, value: ""
                            },
                            "name": {
                                type: "string", InputProps: {
                                    placeholder: "Name of this variant",
                                    label: "Variant name",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable, value: ""
                            },
                            "priceModifier": {
                                type: "string", InputProps: {
                                    placeholder: "Id of this variant",
                                    description: "Expresion to modify price for this variant",
                                    label: "Price Modifier",
                                    variant: "flat",
                                    isRequired: true,
                                }, mutateable, value: ""
                            },
                            "model": {
                                type: "object",
                                mutateable,
                                InputProps: {},
                                value: {
                                    "src": {
                                        type: "string", InputProps: {
                                            placeholder: "Source url for product model",
                                            description: "Product source url. Currently only GLTF/GLB models are supported",
                                            label: "Source",
                                            variant: "flat",
                                            isRequired: true,
                                        }, mutateable, value: ""
                                    },
                                    "type": {
                                        type: "string", InputProps: {
                                            placeholder: "gltf",
                                            label: "Model type",
                                            variant: "flat",
                                            isRequired: true,
                                        }, mutateable: false, value: "gltf"
                                    },
                                }
                            },
                            "images": {
                                type: "array",
                                mutateable,
                                InputProps: {},
                                value: {
                                    type: "object",
                                    mutateable,
                                    InputProps: {},
                                    value: {
                                        "src": {
                                            type: "string", InputProps: {
                                                placeholder: "Image source url",
                                                label: "Image source",
                                                variant: "flat",
                                                isRequired: true,
                                            }, mutateable, value: ""
                                        },
                                        "width": {
                                            type: "number", InputProps: {
                                                placeholder: "400px",
                                                label: "Image width",
                                                variant: "flat",
                                                isRequired: false,
                                            }, mutateable, value: ""
                                        },
                                        "height": {
                                            type: "number", InputProps: {
                                                placeholder: "400px",
                                                label: "Image height",
                                                variant: "flat",
                                                isRequired: false,
                                            }, mutateable, value: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});
export default ProductConfig;
export const withViewProduct = (id: string) => ({
    "id": {
        type: "string", InputProps: {
            placeholder: id,
            description: "Product Id (readonly)",
            label: "Product Id",
            autoFocus: false,
            isRequired: true,
            variant: "flat"
        }, mutateable: false, value: id
    }, ...(withMutations(false))
});
export const withEditProduct = (id: string) => ({
    "id": {
        type: "string", InputProps: {
            placeholder: id,
            description: "Product Id (readonly)",
            label: "Product Id",
            autoFocus: false,
            isRequired: true,
            variant: "flat"
        }, mutateable: false, value: id
    },
    ...ProductConfig,
})