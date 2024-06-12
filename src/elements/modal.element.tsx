export function Modal({children, show, setShow}: any) {
    if (!show) {
        document.body.classList.remove("overflow-hidden");
        return <div className="hidden"></div>
    }

    const closeBG = (e: any) => {
        let htmlTarget: HTMLElement = e.target as HTMLElement;
        if (!htmlTarget.closest(".window")) {
            setShow(false);
        }
    }

    document.body.classList.add("overflow-hidden");
    return <div className="windowBG" onClick={closeBG}>
        <div className="p-4 m-auto rounded-2xl window">{children}</div>
    </div>
}