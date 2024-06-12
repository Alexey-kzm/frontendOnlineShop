'use client'

import {useEffect, useState} from "react";
import {geocodeInput, mapsInit, validateAddress} from "@/app/yandexMap";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import products from "@/products.json"
import {ordersService} from "@/services/orders.service";
import {IOrderProduct} from "@/interfaces/order.interface";
import {useToast} from "@/components/ui/use-toast";

export default function SelectAddressPage() {
    const [address, setAddress] = useState("");
    const [dialogSubmit, setDialogSubmit] = useState(false);

    const {toast} = useToast();

    useEffect(() => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.type = "text/javascript";
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=20dd7c7b-8edf-46ff-a771-666557c9fa83&lang=ru_RU`;
        script.onload = () => {
            // @ts-ignore
            const ymaps = window.ymaps;
            ymaps.ready(() => {
                mapsInit(ymaps, setAddress);
            });
        }
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const addOrder = () => {
        let productsOrderData = localStorage.getItem("productsOrder");
        if (!productsOrderData) return;
        let productsOrder: IOrderProduct[] = JSON.parse(productsOrderData);
        let orderCost = 0;
        productsOrder.forEach((product: IOrderProduct) => {
            orderCost += products[product.productId].price! * product.count;
        });
        ordersService.addOrder({address: address, orderCost: orderCost, products: productsOrder}).then(() => {
            localStorage.removeItem("productsOrder");
        });
    }

    return (
        <div className="flex flex-row m-5 gap-2">
            <div className="w-1/2">
                <div id="map" className="absolute top-[77px] bottom-5 right-[calc(50%+8px)] left-5"></div>
            </div>
            <div className="w-1/2">
                <Input className="mb-3" value={address} placeholder="Ваш адрес" onChange={(e) => {
                    setAddress(e.target.value);
                    geocodeInput(e.target.value);
                }}/>
                <Button onClick={async () => {
                    const info = await validateAddress(address);
                    setAddress(info.address);

                    if (!info.error) {
                        setDialogSubmit(true);
                    }
                    else {
                        toast({
                            title: "Неправильный адрес",
                            description: "Укажите адрес до вашего дома",
                        })
                    }
                }}>Выбрать адрес</Button>
                <AlertDialog open={dialogSubmit} onOpenChange={(newValue) => setDialogSubmit(newValue)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Выбрыть данный адрес?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {address}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Отменить</AlertDialogCancel>
                            <AlertDialogAction onClick={addOrder}>Принять</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
