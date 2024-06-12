import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function NumberInput({ initialValue, onChange, className = ""}: { initialValue: number, onChange: Function, className: string }) {
  //const [count, setCount] = useState(initialValue);
  let count=initialValue;
  const inputRef = useRef<any>(null);

  const plusCount = () => {
    if (count >= 100) return;
    inputRef.current.value = count + 1;
    onChange(count + 1);
   // setCount(count + 1);
  };

  const minusCount = () => {
    if (count <= 1) return;
    inputRef.current.value = count - 1;
    onChange(count - 1);
    //setCount(count - 1);
  };

  const changeCountInput = (newValue: string) => {
    newValue = newValue.replace(/[^\d]/g, '');
    if (newValue !== '' && newValue!==count.toString()) {
      if (Number(newValue) < 1) {
        newValue = String(1);
      } else if (Number(newValue) > 100) {
        newValue = String(100);
      }
     // setCount(Number(newValue));
      onChange(Number(newValue));
      inputRef.current.focus();
    }
    inputRef.current.value = newValue;

  }

  return (<div className={"min-w-[142px] gap-[7px] flex flex-row items-start inputCount " + className}>
    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => minusCount()}>
      <Minus className="h-4 w-4" />
    </Button>
    <Input ref={inputRef} className="w-14 text-center h-9" min="1" max="100"
      defaultValue={count} onChange={(newValue) => {
        changeCountInput(newValue.target.value)
      }} />
    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => plusCount()}>
      <Plus className="h-4 w-4" />
    </Button>
  </div>)
}
export function NumberInputState({ onChange, className = "", state }: { initialValue: number, onChange: Function, className: string, state: [number, Dispatch<SetStateAction<Number>>] }) {
  const [count, setCount] = state;

  const plusCount = () => {
    if (count >= 100) return;
    onChange(count + 1);
    setCount(count + 1);
  };

  const minusCount = () => {
    if (count <= 1) return;
    onChange(count - 1);
    setCount(count - 1);
  };

  const changeCountInput = (newValue: string) => {
    if (newValue === "") {
      newValue = String(count);
    } else if (Number(newValue) < 1) {
      newValue = String(1);
    } else if (Number(newValue) > 100) {
      newValue = String(100);
    }
    setCount(Number(newValue));
    onChange(Number(newValue));
  }

  return (<div className={"min-w-[142px] gap-[7px] flex flex-row items-start inputCount " + className}>
    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => minusCount()}>
      <Minus className="h-4 w-4" />
    </Button>
    <Input type="number" className="w-14 text-center h-9" pattern="[0-9]" min="1" max="100"
      value={count} onChange={(newValue) => {
        changeCountInput(newValue.target.value)
      }} />
    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => plusCount()}>
      <Plus className="h-4 w-4" />
    </Button>
  </div>)
}

