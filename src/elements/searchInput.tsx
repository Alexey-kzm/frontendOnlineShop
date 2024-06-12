'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef } from "react";

export function SearchInput() {
  const ref = useRef<any>();

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      search();
    }
  };
  const search = () => {
    if (ref.current?.value) {
      window.location.href = `products?search=${ref.current!.value}`;
    }
  }

  return (
    <div className="h-9 relative" >
      <Input placeholder="Поиск" className="h-9 w-72" ref={ref} onKeyUp={handleKeyPress} />
      <Button variant="outline" size="icon" className=" absolute right-0 top-0 h-9 w-9 rounded-l-none" onClick={search} onFocus={()=>{ref.current?.focus()}}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
