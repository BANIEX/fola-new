/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { IOption, IOptionSelectNumber, IOptionSelectString } from "@/types/products/product";
import { Select, SelectItem } from "@nextui-org/react";
import { RadioGroup } from '@headlessui/react';
import { useCartState, useProductState } from "@/zustand/product";
import classNames from "@/util/classNames";

export function OptionSelect({ option, opt }: { opt: IOption, option: IOptionSelectNumber | IOptionSelectString }) {
  const [selected, setSelected] = useState<string | number>(option.defaultValue);
  useEffect(() => {
    useCartState.getState().addOption(opt.id, selected);
    useProductState.getState().evaluatePrice();
  }, [selected]);
  return <div className="mt-4">
    <h2 className="mb-3">{opt.name}</h2>
    <Select selectedKeys={[selected]}
      onChange={e => setSelected(option.type === "numerical" ? parseInt(e.target.value) : e.target.value)}
      label={opt.name}
      placeholder={"Select a " + opt.name}
      className="max-w-xs">
      {option.options.map((opt, index) => <SelectItem value={index} className="text-black" key={opt}>{opt}</SelectItem>)}
    </Select>
  </div>
}

export function OptionColorSelect({ option, opt }: { opt: IOption, option: IOptionSelectNumber | IOptionSelectString }) {
  const [selected, setSelected] = useState<string | number>(option.defaultValue);
  useEffect(() => {
    useCartState.getState().addOption(opt.id, selected);
    useProductState.getState().evaluatePrice();
  }, [selected]);
  return <div>
    <RadioGroup value={selected} onChange={value => setSelected(option.type === "numerical" ? parseInt(value) : value)} className="mt-4">
      <RadioGroup.Label>{opt.name}</RadioGroup.Label>
      <div className="flex mt-3 items-center space-x-3">
        {option.options && option.options.map((opt, index) => (
          <RadioGroup.Option
            key={opt}
            value={opt}
            style={{ backgroundColor: opt }}
            className={({ active, checked }) =>
              classNames(
                active && checked ? 'ring ring-offset-1' : '',
                !active && checked ? 'ring-2' : '',
                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
              )
            }
          >
            <RadioGroup.Label as="span" className="sr-only">
              {opt}
            </RadioGroup.Label>
            <span
              aria-hidden="true"
              style={{ backgroundColor: opt }}
              className={classNames(
                'h-8 w-8 rounded-full border border-black border-opacity-10'
              )}
            />
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  </div>
}