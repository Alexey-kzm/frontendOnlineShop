export function Checkbox(props: any) {
    const {onClick, checked} = props;
    if (checked) {
        return (
            <button className="active select"
                    onClick={() => onClick(checked)}><img src="/free-icon-check-1055183.png" alt=""></img></button>
        )
    }
    return (
        <button className="select" onClick={() => onClick(checked)}></button>
    )
}