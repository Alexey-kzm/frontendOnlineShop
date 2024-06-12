'use client'

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {useEffect, useState} from "react";
import {ordersService} from "@/services/orders.service";
import {IGetOrder} from "@/interfaces/order.interface";
import products from "@/products.json"
import {Label} from "@/components/ui/label";
import Link from "next/link";

export default function ordersPage() {
   const [orders, setOrders] = useState<IGetOrder[]>([]);

    useEffect(() => {
        ordersService.getOrders().then((data) => {
            setOrders(data);
        })
    }, []);
    if(orders.length===0){
        return (<div className="mt-4"><Label className="text-foreground mx-10 text-3xl">Вы еще не сделали ни одного заказа</Label></div>)
    }
    return (
        <div className="px-10 pt-4">
            <Accordion type="single" collapsible className="w-full">
                {orders.map((order, index) => (
                    <AccordionItem value={index.toString()} key={index}>
                        <AccordionTrigger><h1 className="flex justify-between w-full pr-7">
                            <span>Заказ №{index}</span><span>Адрес: {order.address}</span></h1></AccordionTrigger>
                        <AccordionContent>
                            {order.products.map((product, productIndex) => (
                                <Link href={"/product/"+product.productId.toString()} className="flex flex-row mb-3 gap-5" key={productIndex}><img src={products[product.productId].icon[0]}
                                                                               alt="" className="w-24 flex-fixed object-contain h-24"/> <h3
                                    className="w-2/5">{products[product.productId].brand+" "+products[product.productId].name}</h3><h3
                                    className="w-24">{(products[product.productId].price*product.count).toLocaleString()}₽</h3><h3
                                    className="w-14">{product.count} шт.</h3></Link>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
