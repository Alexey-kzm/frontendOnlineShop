'use client'

import { useEffect, useState } from "react";
import { ICartProduct } from "@/interfaces/cartProduct.interface";
import products from "@/products.json"
import "@/style.css"
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { callServer } from "next/dist/client/app-call-server";
import { NumberInput } from "@/elements/numberinput.element";
//import {Checkbox} from "@/elements/checkbox.element";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, DeleteIcon, LucideDelete, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { geocodeInput, mapsInit, validateAddress } from "@/app/yandexMap";
import { Input } from "@/components/ui/input";
import { IOrderProduct } from "@/interfaces/order.interface";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function cartPage() {
  const [cartProducts, setCartProducts] = useState<ICartProduct[]>([])
  useEffect(() => {
    let cartData = localStorage.getItem("cart");
    if (cartData) {
      setCartProducts(JSON.parse(cartData));
    }
  }, [])

  let productsCount: number = 0;
  let selectedProductsCount: number = 0;
  let selectedProductsCost: number = 0;
  let deliveryCost: string = "";
  let allCost: number = 0;
  cartProducts.forEach((product) => {
    productsCount += product.count;
    if (product.isSelect) {
      selectedProductsCount += product.count;
      selectedProductsCost += products[product.id].price! * product.count;
      if (selectedProductsCost >= 1000) {
        deliveryCost = "Бесплатно"
        allCost = selectedProductsCost;
      } else {
        allCost = selectedProductsCost + 250;
        deliveryCost = "250₽"
      }
    }
  });

  const saveCartProducts = (newCartProducts: ICartProduct[]) => {
    localStorage.setItem("cart", JSON.stringify(newCartProducts));
    setCartProducts([...newCartProducts]);
  }

  const onChangeCount = (cartProductIndex: number, newValue: number) => {
    let newCartProducts = cartProducts;
    newCartProducts[cartProductIndex].count = newValue;
    saveCartProducts(newCartProducts);
  }

  const changeIsSelect = (cartProductIndex: number) => {
    let newCartProducts = cartProducts;
    newCartProducts[cartProductIndex].isSelect = !newCartProducts[cartProductIndex].isSelect;
    saveCartProducts(newCartProducts);
  }

  const selectAll = (newValue: boolean) => {
    let newCartProducts = cartProducts.map(product => {
      product.isSelect = newValue;
      return product
    });

    saveCartProducts(newCartProducts);
  }

  const deleteProduct = (productId: number) => {
    let newCartProducts = cartProducts.filter(product => product.id !== productId);
    saveCartProducts(newCartProducts);
  }

  const deleteSelectedProducts = () => {
    let newCartProducts = cartProducts.filter(product => !product.isSelect);
    saveCartProducts(newCartProducts);
  }


  function orderButton() {
    const selectedProducts = cartProducts.filter((product) => product.isSelect);
    const newOrder = selectedProducts.map((product: ICartProduct) => {
      if (product.isSelect) {
        return { count: product.count, productId: product.id };
      }
    });

    if (newOrder) {
      deleteSelectedProducts();
      localStorage.setItem("productsOrder", JSON.stringify(newOrder));
      window.location.href = "cart/order";
    }
  }

  if (cartProducts.length <= 0) {
    return (
      <div className="mainDiv">
        <div className="cartText">
          <Label className="text-3xl text-foreground">Корзина пустая</Label>
        </div>
      </div>
    )
  }

  return (
    <div className="mainDiv text-black">
      <div className="cartText">
        <Label className="text-3xl text-foreground">Корзина</Label>
        <div className="productsCount">{productsCount}</div>
      </div>
      <div className="allCarts">
        <div className="productsCarts">
          <Card className="selectAll">
            <Checkbox onCheckedChange={selectAll} checked={productsCount === selectedProductsCount} />
            <h3>Выбрать все</h3>
            <h3 className="deleteSelected" onClick={() => {
              deleteSelectedProducts()
            }}>Удалить выбранное</h3>
          </Card>
          <Card className="cartList">
            {cartProducts.map((cartProduct: ICartProduct, cartProductIndex: number) =>
            (
              <div key={cartProduct.id} className="item">
                <Checkbox onCheckedChange={() => changeIsSelect(cartProductIndex)}
                  checked={cartProduct.isSelect} />

                <Link className="name" href={"/product/" + cartProduct.id.toString()}>
                  <img src={products[cartProduct.id].icon[0]} alt=""
                    className="w-[85px] object-contain flex-fixed max-h-32" />
                  <h3>{products[cartProduct.id].brand+" "+products[cartProduct.id].name}</h3>
                </Link>

                <div className="cost"><h3>{(products[cartProduct.id].price! * cartProduct.count).toLocaleString()}₽</h3>
                </div>
                <NumberInput initialValue={cartProduct.count}
                  onChange={(newValue: number) => onChangeCount(cartProductIndex, newValue)} className="w-[20%]" />
                <Button variant="outline" size="icon" className="h-9 w-9"
                  onClick={() => deleteProduct(cartProduct.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )
            )}
          </Card>
        </div>
        <Card className="orderProducts">
          <button className="orderButton" onClick={orderButton}><h3>Перейти к оформлению</h3></button>
          <div className="spaceBetween">
            <span>Товары ({selectedProductsCount.toLocaleString()})</span>
            <span>{selectedProductsCost.toLocaleString()}₽</span>
          </div>
          <div className="spaceBetween">
            <span>Доставка</span>
            <span>{deliveryCost}</span>
          </div>
          <div className="spaceBetween allCostName">
            <h3><span>Итого</span></h3>
            <h3><span>{allCost.toLocaleString()}₽</span></h3>
          </div>
        </Card>
      </div>
    </div>

  )
}
