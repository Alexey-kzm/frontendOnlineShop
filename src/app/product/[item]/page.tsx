'use client'

import { useParams } from "next/navigation"
import products from "@/products.json"
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/elements/numberinput.element";
import { useEffect, useRef, useState } from "react";
import "@/style.css"
import { ICartProduct } from "@/interfaces/cartProduct.interface";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProductPage() {
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [cartProducts, setCartProducts] = useState<ICartProduct[]>([]);
  const item = Number(useParams<{ item: string }>().item);
  const [count, setCount] = useState(1);

  useEffect(() => {
    let cartJSON = localStorage.getItem("cart");
    if (cartJSON) {
      const cartData: ICartProduct[] = JSON.parse(cartJSON);
      setCartProducts(cartData);
      const _isInCart = isInCart(cartData);
      if (_isInCart.isInCart) {
        setCount(cartData[_isInCart.index].count);
      }
    }
  }, [])

  const drawCompound = () => {
    if (products[item].compound && products[item].compound != "HTML") {
      return (
        <div className="mt-5">
          <h1 className="text-xl">Состав:</h1>
          <div>{products[item].compound}</div></div>
      )
    }
  }

  const isInCart = (cartData: ICartProduct[]) => {
    let _isInCart = false;
    let index = 0;
    for (let i = 0; i < cartData.length; i++) {
      if (cartData[i].id === item) {
        _isInCart = true;
        index = i;
      }
    }
    return { isInCart: _isInCart, index };
  }

  const removeFromCart = () => {
    let newCartProducts = cartProducts.filter(product => product.id !== item);
    saveCartProducts(newCartProducts);
  }

  const buyItem = () => {
    const newCartProducts = [...cartProducts];
    newCartProducts.push({ id: item, count: count, isSelect: true });
    saveCartProducts(newCartProducts);
  }

  const onChangeCount = (newCount: number) => {
    const newCartProducts = [...cartProducts];
    newCartProducts[isInCart(cartProducts).index].count = newCount;
    setCount(newCount);
    saveCartProducts(newCartProducts);
  }

  const saveCartProducts = (newCartProducts: ICartProduct[]) => {
    localStorage.setItem("cart", JSON.stringify(newCartProducts));
    setCartProducts([...newCartProducts]);
  }
  const buyButton = () => {
    if (isInCart(cartProducts).isInCart) {
      return (<Button className="text-base w-[180px]" onClick={removeFromCart} variant="destructive">Удалить из корзины</Button>)
    }
    else {
      return (<Button className="text-lg w-[180px]" onClick={buyItem}>В корзину</Button>)
    }
  }


return (
  <div className="m-auto w-fit mt-3 max-w-[1000px]">
    <h1 className="text-foreground mb-4 text-2xl">{products[item].brand} {products[item].name}</h1>
    <div className="flex flex-row items-start">
      <ScrollArea className="h-[528px] mr-2 w-24">
        <div className="flex flex-col gap-2 w-24">
          {products[item].icon.map((icon, index) => (
            <img src={icon} alt="" key={index} className={"w-24 object-contain h-24 flex-fixed border-2 " + (index === activeIconIndex ? "border-foreground " : "border-border ")} onClick={() => setActiveIconIndex(index)} />
          ))}
        </div>
      </ScrollArea>
      <img src={products[item].icon[activeIconIndex]} className="w-[528px] flex-fixed max-h-[600px] object-contain min-h-[528px]" />
      <div className="ml-4">
        <p className="text-2xl mb-2">{(products[item].price * count).toLocaleString()}₽</p>
        <NumberInput initialValue={count} onChange={onChangeCount} className="mb-2 w-[180px] justify-between" />
        {buyButton()}
      </div>
    </div>
    <div>{drawCompound()}</div>
  </div>
)
} 
