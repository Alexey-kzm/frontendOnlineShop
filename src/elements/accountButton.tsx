'use client'

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CircleUserRound, LogIn, LogOut, ShoppingBag, User, UserRound} from "lucide-react";
import {userService} from "@/services/user.service";
import {getAccessToken, getRefreshToken, logOut, removeAccessFromStorage} from "@/services/auth-token.service";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {authService} from "@/services/auth.service";
import {IUser} from "@/interfaces/auth.interface";

//TODO: рефакторинг

const registerFormSchema = z.object({
    name: z.string().min(3, {
        message: "Имя должно быть больше 3 символов"
    }).max(30, {message: "Имя не должно быть больше 30 символов"}),
    lastname: z.string().min(3, {
        message: "Фамилия должна быть больше 3 символов"
    }).max(30, {message: "Фамилия не должна быть больше 30 символов"}),
    email: z.string().min(1, {
        message: "Это поле должно быть заполнено"
    }).email("Не правильный адрес электронной почты"),
    password: z.string().min(3, {
        message: "пароль должен быть больше 3 символов"
    }).max(30, {message: "Пароль не должен быть больше 30 символов"}),
})

const loginFormSchema = z.object({
    email: z.string().min(1, {
        message: "Это поле должно быть заполнено"
    }).email("Не правильный адрес электронной почты"),
    password: z.string().min(3, {
        message: "пароль должен быть больше 3 символов"
    }).max(30, {message: "Пароль не должен быть больше 30 символов"}),
})

export function RegisterForm({update}: { update: Function }) {
    const registerForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            lastname: "",
            password: "",
            email: ""
        },
    })

    function registerSubmit(values: z.infer<typeof registerFormSchema>) {
        authService.register({
            name: values.name,
            lastname: values.lastname,
            email: values.email,
            password: values.password
        }).then(r => {
            update();
        });
    }

    return (<Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(registerSubmit)} className="space-y-8">
            <FormField
                control={registerForm.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                            <Input placeholder="Ваше имя" {...field} />
                        </FormControl>

                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={registerForm.control}
                name="lastname"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                            <Input placeholder="Ваша фамилия" {...field} />
                        </FormControl>

                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={registerForm.control}
                name="email"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Ваша электронная почта" {...field} />
                        </FormControl>

                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={registerForm.control}
                name="password"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                            <Input placeholder="Придумайте пароль" {...field} type="password"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button type="submit">Зарегистрироваться</Button>
        </form>
    </Form>)
}

export function LoginForm({update}: { update: Function }) {
    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    function loginSubmit(values: z.infer<typeof loginFormSchema>) {
        authService.login({email: values.email, password: values.password}).then(r => {
            console.log(r.data);
            update();
        });
    }

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(loginSubmit)} className="space-y-8">
                <FormField
                    control={loginForm.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Ваша электронная почта" {...field} />
                            </FormControl>

                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={loginForm.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите свой пароль" {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Войти</Button>
            </form>
        </Form>
    )
}

function AuthDialog({update}: { update: Function }) {
    function AuthDialogContent() {
        const [authWindow, setAuthWindow] = useState(authWindowStates.login);

        function RegisterDialog() {
            return (

                <><DialogHeader>
                    <DialogTitle>Регистрация в аккаунт</DialogTitle>
                    <DialogDescription>Уже есть аккаунт? <span className="cursor-pointer hover:underline"
                                                               onClick={() => {
                                                                   setAuthWindow(authWindowStates.login);
                                                               }}>Войти</span></DialogDescription>
                </DialogHeader><RegisterForm update={update}/></>
            )
        }

        function LoginDialog() {
            return (
                <><DialogHeader>
                    <DialogTitle>Вход в аккаунт</DialogTitle>
                    <DialogDescription>Нет аккаунта? <span className="cursor-pointer hover:underline"
                                                           onClick={() => {
                                                               setAuthWindow(authWindowStates.register);
                                                           }}>Зарегистрироваться</span></DialogDescription>
                </DialogHeader><LoginForm update={update}/></>
            )
        }

        return (
            authWindow === authWindowStates.login ? <LoginDialog/> : <RegisterDialog/>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><LogIn className="mr-2 h-4 w-4"/> Войти в аккаунт</Button>
            </DialogTrigger>
            <DialogContent>

                <AuthDialogContent/>

            </DialogContent>
        </Dialog>
    )
}


enum authWindowStates {
    register = 1,
    login = 2,
    none = 0,
}

export function AccountButton() {
    const [accountInfo, setAccountInfo] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        update();
    }, []);

    const update = () => {
        if (getRefreshToken()) {
            userService.getProfile().then((e: IUser) => {
                if (e.id) {
                    setAccountInfo(e);
                } else {
                    setAccountInfo(undefined);
                }
            });
        } else {
            setAccountInfo(undefined);
        }
    }


    return (
        accountInfo ? (<DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="p-px rounded-full self-center h-9 w-9">
                    <UserRound className="w-5 h-5"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2">
                <DropdownMenuLabel>
                    <p>Мой Аккаунт</p>
                    <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                        {accountInfo.name} {accountInfo.lastname}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <a href="/orders">
                            <ShoppingBag className="mr-2 h-4 w-4"/>
                            <span>Заказы</span>
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        logOut();
                        update();
                    }}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>Выход</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>) : (

            <AuthDialog update={update}/>
        )
    )
}
