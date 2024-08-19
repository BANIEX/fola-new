import { PlusIcon } from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Input, Textarea, Button } from "@nextui-org/react";

interface IJSONEditorSchemaItem {
    type: "object" | "string" | "number" | "array" | "big-string",
    mutateable: boolean,
    InputProps: object,
    name?: string,
    value: IJSONEditorSchemaItem | string | number | IJSONEditorSchema,
}
interface IJSONEditorSchema {
    [x: string]: IJSONEditorSchemaItem,
}
function getValue(obj: object, keys: string[]) {
    let current = obj
    for (const key of keys) {
        current = current?.[key]
    }
    return current
}
// window.getValue = getValue;
function getValueAtObjectPath(obj: object, path: string[]): object | object[] {
    let val = obj;
    let key = path.shift();
    while (key && val) {
        val = val[key];
        key = path.shift();
    };
    return val;
}
const iconClasses = "text-xl text-default-500 pointer-events-none w-[20px] h-[20px] flex-shrink-0";
// { [x: number]: object; length: any; toString: any; toLocaleString: any; pop: any; push: any; concat: any; join: any; reverse: any; shift: any; slice: any; sort: any; splice: any; unshift: any; indexOf: any; lastIndexOf: any; every: any; some: any; forEach: any; map: any; filter: any; reduce: any; reduceRight: any; find: any; findIndex: any; fill: any; copyWithin: any; entries: any; keys: any; values: any; includes: any; flatMap: any; flat: any; at: any; findLast: any; findLastIndex: any; toReversed: any; toSorted: any; toSpliced: any; with: any; "__@iterator@47": any; "__@unscopables@81": any; }
export default function JSONEditor({
    data, schema, onDataChange
}: {
    data: object | Array<object>, schema: IJSONEditorSchema, onDataChange: (data: object) => any
}) {
    const handleArrayItemAddition = (path: Array<string>) => {
        const updatedData = { ...data };
        let currentLevel = updatedData;

        path.forEach((key, index) => {
            // if (index === path.length - 1) {
            //     currentLevel[key] = currentLevel[key] || [];
            //     // path.at(index - 1)
            //     currentLevel[key].push(currentLevel[path.at(index - 1)] || {});
            // } else {
            //     currentLevel[key] = currentLevel[key] || currentLevel[path.at(index - 1)] || {};
            //     currentLevel = currentLevel[key];
            // }
            if (index === (path.length - 1)) {
                currentLevel[key] = currentLevel[key] || [];
                // path.at(index - 1)
                currentLevel[key].push({});
            } else {
                currentLevel[key] = currentLevel[key] || {};
                currentLevel = currentLevel[key];
            }
        });
        onDataChange(updatedData);
    };
    const createNewItem = (schemaItem: IJSONEditorSchemaItem): object => {
        const newItem: any = {};
        // Initialize the new item based on the schema
        if (schemaItem) {
            Object.keys(schemaItem).forEach((key) => {
                const item = schemaItem[key];
                switch (item.type) {
                    case "object":
                        newItem[key] = createNewItem(item.value as IJSONEditorSchemaItem);
                        break;
                    case "array":
                        newItem[key] = [createNewItem(item.value as IJSONEditorSchemaItem)]; // Initialize nested array with one item
                        break;
                    case "string":
                        newItem[key] = item.value as string;
                        break;
                    case "number":
                        newItem[key] = item.value as number;
                        break;
                    default:
                        break;
                }
            });
        }
        return newItem;
    };
    const handleInputChange = (path: string[], value: string | number) => {
        const updatedData = { ...data };
        let currentLevel = updatedData;
        path.forEach((key, index) => {
            if (index === path.length - 1) {
                currentLevel[key] = value;
            } else {
                currentLevel[key] = currentLevel[key] || {}; // Initialize empty object if not exists
                currentLevel = currentLevel[key];
            }
        });

        // path.forEach((key, index) => {
        //     if (index === path.length - 1) currentLevel[key] = value;
        //     else {
        //         currentLevel[key] = { ...currentLevel[key] };
        //         currentLevel = currentLevel[key];
        //     }
        // });
        onDataChange(updatedData);
    };
    const handleArrayItemRemoval = (path: Array<string>, index: number) => {
        const updatedData = { ...data };
        let currentLevel = updatedData;

        path.forEach((key: string) => {
            currentLevel = currentLevel[key];
        });

        currentLevel.splice(index, 1);
        onDataChange(updatedData);
    };

    const itemRenderer = (keys: Array<string>, item: IJSONEditorSchemaItem) => {
        switch (item.type) {
            case "string":
                
                const val = getValue(data, keys);
                return (
                    <li key={keys.join()}>
                        {/*@ts-ignore*/}
                        <Input type="text" style={{ width: "100%" }} {...item.InputProps} defaultValue={((typeof val === "object" ? Object.keys(val).length === 0 ? null : JSON.stringify(val) : val) || item.value).toString() ?? ""}
                            onChange={(e) => handleInputChange(keys, e.target.value)}
                            isDisabled={!item.mutateable} />
                    </li>
                );
            case "big-string":
                return (
                    <li key={keys.join()}>
                        <Textarea
                            minRows={4} isDisabled={!item.mutateable}
                            onChange={(e) => handleInputChange(keys, e.target.value)}
                            defaultValue={(((getValue(data, keys)) || item.value).toString()) ?? ""} placeholder={item.value.toString() ?? ""} {...item.InputProps}
                        />
                    </li>
                );
            case "number":
                return (
                    <li key={keys.join()}>
                        <Input type="number" {...item.InputProps} defaultValue={((((getValue(data, keys)) || item.value)) ?? 0.0)}
                            onChange={(e) => handleInputChange(keys, parseFloat(e.target.value))} isDisabled={!item.mutateable} />
                    </li>
                );
            case "object":
                return (
                    <div className="flex align-center space-between">
                        <div className="w-[1px] bg-gray-200 rounded h-[100%] mr-[10px]" />
                        <ul className="relative grid ml-5 grid-col-1 md:xl:grid-col-2 gap-4">
                            <h4 className="text-gray-500">{keys.at(-1) ?? ""}</h4>
                            {Object.entries(item.value).map(([name, item]) => (itemRenderer([...keys, name], item)))}
                        </ul>
                    </div>
                );
            case "array":
                const v = getValue(data, keys)?.length;
                return (
                    <ul className="grid grid-col-1 md:xl:grid-col-2 gap-4">
                        <h2 className="text-gray-500">{keys.at(-1)}</h2>
                        {!!v && ([...new Array(v)]).map((m: object, index: number) => (<div key={index} className="flex items-center justify-space-between">
                            <Button onClick={() => handleArrayItemRemoval([...keys], index)} className="bg-gray-50 border h-full mr-2" isIconOnly><XCircleIcon className="w-[1.5rem] text-red-500" /></Button>
                            {itemRenderer([...keys, index.toString()], item.value)}
                        </div>))}
                        <li>
                            {item.mutateable && <Button variant="flat" onClick={() => handleArrayItemAddition([...keys])}>
                                <PlusIcon className={iconClasses} /> Add new element to {/*(keys.at(-2) ? keys.at(-2) + '.' : '') + */ item.name ?? keys.at(-1)}
                            </Button>}
                        </li>
                    </ul>
                )
        }
        return <div className="text-black">{keys.at(-1)}: {JSON.stringify(item)}</div>
    }
    return (
        <ul className="grid grid-col-1 md:xl:grid-col-2 gap-4">
            <h4 className="text-gray-500">Root</h4>
            {/* {Object.entries(Object.assign({}, item.value)).map(([name, item]) => (itemRenderer([...keys, name], item)))} */}
            {Object.entries(schema.value).map(([name, item]) => (itemRenderer([name], item)))}
            {/* <li><Button variant="flat"><PlusIcon className={iconClasses} /> Add new item</Button></li> */}
        </ul>
    )
}