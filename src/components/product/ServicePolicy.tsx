import { Listbox, ListboxItem } from "@nextui-org/react";

export default function ServicePolicy() {
    return (
        <div className={"border bg-gray-50 p-4 mt-5 rounded"}>
            <h2 className="mb-3"><strong>Service Policy</strong></h2>
            <div>
                14 days free & easy return.
                <br/>Change of mind is not applicable as a return reason for this product due to one or more of the following reasons:

                <Listbox>
                    {`Not applicable for overseas seller
  Digital goods such as mobile top up cards
  All grocery categories
  All swimwear and underwear
  All products shipped from overseas
  All products delivered by seller after signing the delivery slip
  Not applicable on Bikes and Cars`.split('\n').map(a => <ListboxItem key={a}>{a}</ListboxItem>)}
                </Listbox>
            </div>
        </div>
    )
}