
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ThemeProvider} from "@/components/theme-provider";
import {useTheme} from "next-themes";
import {ToggleTheme} from "@/elements/toggleTheme";
import {AccountButton} from "@/elements/accountButton";
import {PawPrint} from "lucide-react";
import {Toaster} from "@/components/ui/toaster";
import {NavMenu} from "@/elements/navMenu";
import {SearchInput} from "@/elements/searchInput";
import {Suspense} from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


function MainNav(){
    return(
        <div className="flex items-start md:items-center gap-6 text-sm font-medium flex-col md:flex-row">
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="">Корзина</Link>
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="">Каталог</Link>
        </div>
    )
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>

    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <header
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container flex h-14 items-center">
                <div className="md:hidden mr-2">

                </div>
                <div className="mr-4 md:flex items-center">
                    <PawPrint />
                </div>
                <div className="items-center flex-1 flex">
                    <div className=" md:flex"><NavMenu/></div>
                    <div className="flex flex-1 items-center justify-end space-x-3">
<SearchInput/>
                        <ToggleTheme/>
                        <AccountButton/>
                    </div>
                </div>
            </div>
        </header>
        <Suspense fallback={<>Загрузка...</>}>
            {children}
        </Suspense>
        <Toaster/>
    </ThemeProvider>
    </body>
    </html>
  );
}
