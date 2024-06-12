'use client'

import products from "../../products.json"
import "../../style.css"
import { useEffect, useState } from "react";
import { ICartProduct } from "@/interfaces/cartProduct.interface";
import { IProduct } from "@/interfaces/product.interface";
import { NumberInput } from "@/elements/numberinput.element";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuRadioItem, DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu";
import { ArrowDownUp, Check, ChevronsUpDown, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

enum sortEnum {
  name,
  bigPrice,
  smallPrice
}

export default function productsPage() {
  const [cartProducts, setCartProducts] = useState<ICartProduct[]>([]);
  const [valueBrand, setValueBrand] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState<sortEnum>(sortEnum.name);
  const searchParams = useSearchParams();

  const catalogId = searchParams.get("catalog")?.split(",");
  const search = searchParams.get("search");

  useEffect(() => {
    let cartData = localStorage.getItem("cart");
    if (cartData) {
      setCartProducts(JSON.parse(cartData));
    }
    let productMaxPrice = 0;
    products.forEach((product) => {
      if (((catalogId && catalogId.includes(String(product.catalogId)) && !search) || (search && (product.brand + " " + product.name).toLocaleLowerCase().includes(search.toLocaleLowerCase()))) && (!valueBrand.includes(product.brand) || valueBrand.length == 0)) {
        if (product.price > productMaxPrice) { productMaxPrice = product.price; }
      }
    });
    setMaxPrice(productMaxPrice);
  }, [])

  const getProductList = () => {
    let newProductList = products.filter((product) => (((catalogId && catalogId?.includes(String(product.catalogId)) && !search) || (search && (product.brand + " " + product.name).toLocaleLowerCase().includes(search.toLocaleLowerCase()))) && (valueBrand.length == 0 || valueBrand.includes(product.brand)) && (product.price <= maxPrice && product.price >= minPrice)));

    if (sort === sortEnum.smallPrice) {
      newProductList = newProductList.sort((first: IProduct, second: IProduct) => (Number(first.price > second.price)));
    }
    else if (sort === sortEnum.bigPrice) {
      newProductList = newProductList.sort((first: IProduct, second: IProduct) => (Number(first.price < second.price)));
    }
    else if (sort === sortEnum.name) {
      newProductList.sort((first: IProduct, second: IProduct) => (first.name.localeCompare(second.name)));
    }

    return newProductList;
  }
  const saveCartProducts = (newCartProducts: ICartProduct[]) => {
    localStorage.setItem("cart", JSON.stringify(newCartProducts));
    setCartProducts([...newCartProducts]);
  }

  const addToCart = (id: number) => {
    let isAdded = false;
    if (cartProducts.length > 0) {
      cartProducts.forEach((product) => {
        if (id === product.id) {
          product.count++;
          isAdded = true;
        }
      })
    }
    if (!isAdded) {
      let newCartProduct: ICartProduct = { count: 1, isSelect: true, id: id };
      cartProducts.push(newCartProduct);
      isAdded = true;
    }
    if (isAdded) saveCartProducts(cartProducts);
  }

  const drawBuyOrCount = (id: number) => {
    const onChangeInput = (cartProductId: number, newValue: number) => {
      let newCartProducts = cartProducts;
      newCartProducts[cartProductId].count = newValue;
      saveCartProducts(newCartProducts)
    }

    let cartProductIndex = -1;
    let cartProduct = cartProducts.find((product, index) => {
      if (id === product.id) {
        cartProductIndex = index;
        return true;
      }
      return false;
    });

    if (cartProduct) {
      return (<NumberInput initialValue={cartProduct.count}
        onChange={(newValue: number) => onChangeInput(cartProductIndex, newValue)} className="" />)
    }

    return (<Button variant="outline" className="h-9" onClick={(e) => addToCart(id)}>
      <h3>В корзину</h3>
    </Button>)
  }

  const getAllBrands = () => {
    const allBrands: string[] = []
    products.forEach((product: IProduct, index) => {
      if (((catalogId?.includes(String(product.catalogId)) && !search) || (search && (product.brand + " " + product.name).toLocaleLowerCase().includes(search.toLocaleLowerCase()))) && !allBrands.includes(product.brand)) {
        allBrands.push(product.brand);
      }
    })
    return allBrands;
  }
  const validateNumberInput = (input: string) => {
    let newInput = input.replace(/[^\d]/g, '');

    if (Number(newInput) < 0) { newInput = String(0); }
    if (newInput == "") { return ""; }
    return Number(newInput).toString();
  }

  const getSortFullName = (sortNumber: sortEnum) => {
    if (sortNumber === sortEnum.name) return "По алфавиту";
    else if (sortNumber === sortEnum.smallPrice) return "По возрастанию цены";
    else if (sortNumber === sortEnum.bigPrice) return "По убыванию цены";
  }
  return (
    <div className="mainPage pt-[10px]">
      <Card className="w-[1260px] h-12 ml-auto mr-auto mb-[16px] rounded-[15px] flex justify-between p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-12 w-fit text-sm rounded-s-[15px] rounded-e-none flex flex-row font-medium" variant="ghost">
              <ArrowDownUp className="mr-2 h-4 w-4" />
              {getSortFullName(sort)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={sort.toString()} onValueChange={(newValue) => setSort(Number(newValue))}>
              <DropdownMenuRadioItem value={sortEnum.name.toString()}>{getSortFullName(sortEnum.name)}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={sortEnum.bigPrice.toString()}>{getSortFullName(sortEnum.bigPrice)}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={sortEnum.smallPrice.toString()}>{getSortFullName(sortEnum.smallPrice)}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-sm rounded-e-[15px] h-12 rounded-s-none">
              <Filter className="mr-2 h-4 w-4" />Фильтры
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Бренд</Label>
                <Popover >
                  <PopoverTrigger asChild className="h-8 col-span-2">
                    <Button
                      variant="outline"
                      role="combobox"

                      className="justify-between px-3"
                    >
                      <span className={"overflow-hidden " + (valueBrand.length===0 && "opacity-50")}>{valueBrand.length !== 0
                        ? valueBrand.join(", ")
                        : "Выбрать бренд"}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Поиск" />
                      <CommandList>
                        <CommandGroup>
                          {
                            getAllBrands().map((brand, index) => {
                              return (
                                <CommandItem
                                  key={index}
                                  value={brand}
                                  onSelect={(currentValue) => {
                                    valueBrand.includes(brand) ? setValueBrand(valueBrand.filter((brand) => brand !== currentValue)) : setValueBrand([...valueBrand, brand])
                                  }}
                                >
                                  <Check
                                    className={
                                      "mr-2 h-4 w-4 " +
                                      (valueBrand.includes(brand) ? "opacity-100" : "opacity-0")
                                    } />
                                  {brand}
                                </CommandItem>
                              )
                            })
                          }
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Мин. цена</Label>
                <Input
                  id="maxWidth"
                  defaultValue={minPrice.toString()}
                  className="col-span-2 h-8"
                  onChange={(newValue) => {
                    newValue.target.value = validateNumberInput(newValue.target.value);
                    setMinPrice(Number(newValue.target.value))
                  }}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Макс. цена</Label>
                <Input
                  id="height"
                  defaultValue={maxPrice.toString()}
                  className="col-span-2 h-8"
                  onChange={(newValue) => {
                    newValue.target.value = validateNumberInput(newValue.target.value);
                    setMaxPrice(Number(newValue.target.value))
                  }}
                />
              </div>
            </div>

          </PopoverContent>
        </Popover>

      </Card>

      <div className="listProduct">
        {getProductList().map((product: IProduct) => (

          <Card className="item transition-all" key={product.id}>
            <Link href={"/product/" + product.id.toString()} className="bg-white rounded-t-[15px]"><img src={product.icon[0]} alt="products" className="max-h-80 object-contain" /></Link>
            <Link href={"/product/" + product.id.toString()}><h3 className="productName">{product.brand + " " + product.name}</h3></Link>
            <div className="price">{product.price.toLocaleString()}₽</div>
            {drawBuyOrCount(product.id)}
          </Card>

        ))}
      </div>
    </div>
  )
}
