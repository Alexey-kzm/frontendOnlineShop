'use client'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DateTimePicker} from "@/components/ui/datetimepicker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {date, z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage, Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {DateTime} from "luxon";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon, Check} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {SelectSingleEventHandler} from "react-day-picker";
import {Input} from "@/components/ui/input";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {additionalServicesService} from "@/services/additional-services.service";
import {AdditionalServicesTypes} from "@/interfaces/additional-services.interface";

//TODO: Рефакторинг
//TODO: Закрытие окна при выборе времени

const categoryObjects = [{
    categoryName: "Собаки",
    url: "/products?catalog=5,6,8,7",
    items: [
        {
            categoryName: "Игрушки",
            url: "/products?catalog=5",
        },
        {
            categoryName: "Лежанки",
            url: "/products?catalog=6",
        },
        {
            categoryName: "Амуниция",
            url: "/products?catalog=8",
        },
        {
            categoryName: "Корм",
            url: "/products?catalog=7",
        }]
},
    {
        categoryName: "Кошки",
        url: "/products?catalog=13,14,15,16",
        items: [
            {
                categoryName: "Игрушки",
                url: "/products?catalog=13",
            },
            {
                categoryName: "Корм",
                url: "/products?catalog=14",
            },
            {
                categoryName: "Лежанки",
                url: "/products?catalog=15",
            },
            {
                categoryName: "Груминг",
                url: "/products?catalog=16",
            }]
    },
    {
        categoryName: "Птицы",
        url: "/products?catalog=9,10,11,12",
        items: [
            {
                categoryName: "Корм",
                url: "/products?catalog=9",
            },
            {
                categoryName: "Лакомства",
                url: "/products?catalog=10",
            },
            {
                categoryName: "Миски и поилки",
                url: "/products?catalog=11",
            },
            {
                categoryName: "Игрушки",
                url: "/products?catalog=12",
            }]
    },
    {
        categoryName: "Грызуны",
        url: "/products?catalog=3,1,2,4",
        items: [
            {
                categoryName: "Игрушки",
                url: "/products?catalog=4",
            },
            {
                categoryName: "Клетки",
                url: "/products?catalog=2",
            },
            {
                categoryName: "Корм",
                url: "/products?catalog=1",
            },
            {
                categoryName: "Миски, поилки",
                url: "/products?catalog=3",
            }]
    },
]

function CatalogMenu() {
    const [activeCategory, setActiveCategory] = useState(0);

    const onCategorySelected = (itemId: number) => {
        setActiveCategory(itemId);
    }

    return (
        <div className="p-4 gap-4 w-[400px] flex flex-row">
            <div className="w-1/2">
                {categoryObjects.map((category: any, id) => (
                    <div
                        key={id.toString()}
                        className={`block select-none space-y-1 rounded-md p-2 ${id === activeCategory ? "bg-accent text-accent-foreground" : ""} `}
                        onMouseEnter={() => onCategorySelected(id)}
                        onClick={() => window.location.href = category.url}>
                        {category.categoryName}
                    </div>
                ))}
            </div>
            <div className="w-1/2">
                {categoryObjects[activeCategory].items.map((category: any, id) => (
                    <div
                        key={id.toString()}
                        onClick={() => window.location.href = category.url}
                        className="block select-none space-y-1 rounded-md p-2 transition-colors hover:bg-accent
                        hover:text-accent-foreground">
                        {category.categoryName}
                    </div>
                ))}
            </div>
        </div>
    )
}


const ServiceSchema = z.object({
    serviceType: z
        .nativeEnum(AdditionalServicesTypes)
    ,
    dateTime: z.date(),
})

export function ServiceMenu() {
    const [activeWindow, setActiveWindow] = useState(false);
    const [availableTime, setAvailableTime] = useState<string[]>([]);

    useEffect(() => {
        updateAvailableTime(DateTime.now());
    }, []);

    const updateAvailableTime = (date: DateTime) => {
        additionalServicesService.getWithinDay(date.toJSDate().toISOString()).then((servicesOnThisDay) => {
            const newAvailableTimeArray: string[] = [];
            const isThisDay = (date.year === DateTime.now().year) && (date.month === DateTime.now().month) && (date.day === DateTime.now().day);
            const minHours = isThisDay ? DateTime.now().hour : 0;
            const minMinutes = isThisDay ? DateTime.now().minute : 0;
            for (let i = minHours; i < 24; i++) {
                for (let j = i === minHours ? minMinutes : 0; j < 60; j++) {
                    let isBusyTime = false;
                    const thisDateTime = date.set({hour:i,minute:j});
                    servicesOnThisDay.forEach(service => {
                        const interval = thisDateTime.diff(DateTime.fromISO(service.time), "minutes").minutes;
                        if (interval <= 30 && interval >= -30) {
                            isBusyTime = true;
                        }
                    })
                    if (!isBusyTime) {
                        newAvailableTimeArray.push(thisDateTime.toFormat("HH:mm"));
                    }
                }
            }

            const activeTime = date.toFormat("HH:mm");
            let isActiveTimeCorrect = false;
            for(const time of newAvailableTimeArray){
                if(activeTime===time){
                    isActiveTimeCorrect=true;
                    break;
                }
            }
            if(!isActiveTimeCorrect)form.setValue("dateTime",getFirstAvailableDateTime(newAvailableTimeArray[0],date));

            setAvailableTime(newAvailableTimeArray);
        });
    }

    const getFirstAvailableDateTime = (time:string,date:DateTime) => {
        if(!time) return new Date();
        const timeSplit = time.split(":");
        return date.set({hour: Number(timeSplit[0]), minute: Number(timeSplit[1])}).toJSDate();
    }

    const form = useForm<z.infer<typeof ServiceSchema>>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            serviceType: AdditionalServicesTypes.AMBULANCE,
            dateTime: getFirstAvailableDateTime(availableTime[0],DateTime.now())
        }
    })

    function onSubmit(data: z.infer<typeof ServiceSchema>) {
        additionalServicesService.createNew({type: data.serviceType, dateTime: data.dateTime.toISOString()}).then(r => {
            setActiveWindow(false);
        });
    }

    return (
        <div className="p-4 w-[250px] flex flex-col">
            <Dialog open={activeWindow} onOpenChange={(open) => {
                setActiveWindow(open)
            }}>
                <DialogContent className="w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Дополнительные услуги</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="serviceType"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Тип</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value={AdditionalServicesTypes.AMBULANCE.toString()}>Ветеринар</SelectItem>
                                                <SelectItem value={AdditionalServicesTypes.ADOPT.toString()}>Приютить
                                                    животное</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateTime"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Дата и время</FormLabel>
                                        <div className="flex flex-row gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild className="z-10">
                                                    <FormControl>

                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-full justify-start text-left font-normal',
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>

                                                            {DateTime.fromJSDate(field.value).toFormat('DDD')}
                                                        </Button>


                                                    </FormControl>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(day, selected) => {
                                                            const selectedDay = DateTime.fromJSDate(selected);
                                                            const modifiedDay = selectedDay.set({
                                                                hour: field.value.getHours(),
                                                                minute: field.value.getMinutes(),
                                                            });

                                                            updateAvailableTime(modifiedDay);
                                                            field.onChange(modifiedDay.toJSDate());
                                                        }}
                                                        disabled={(date) =>
                                                            DateTime.fromJSDate(date).set({hour:23,minute:59}).toJSDate() < new Date(Date.now())
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-min justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {DateTime.fromJSDate(field.value).toFormat('HH:mm')}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Найти нужное время"/>
                                                        <CommandList>
                                                            <CommandEmpty>На этот день нельзя записаться</CommandEmpty>
                                                            <CommandGroup>
                                                                {availableTime.map((time, index) => {
                                                                    return (
                                                                        <CommandItem
                                                                            value={time}
                                                                            key={index}
                                                                            onSelect={() => {
                                                                                const hours = Number.parseInt(time.split(':')[0] || '00', 10);
                                                                                const minutes = Number.parseInt(time.split(':')[1] || '00', 10);
                                                                                const modifiedDay = DateTime.fromJSDate(field.value).set({
                                                                                    hour: hours,
                                                                                    minute: minutes
                                                                                });

                                                                                field.onChange(modifiedDay.toJSDate());
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    time === DateTime.fromJSDate(field.value).toFormat('HH:mm')
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {time}
                                                                        </CommandItem>
                                                                    )
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>

                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Отправить</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <div
                className={`block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground" `}
                onClick={() => {
                    setActiveWindow(true);
                }}>
                Ветеринар
            </div>
            <div
                className={`block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground" `}
                onClick={() => {
                }}>
                Приютить животвное
            </div>
        </div>
    )
}

export function NavMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Каталог</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <CatalogMenu/>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Услуги</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ServiceMenu/>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/cart" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Корзина
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
