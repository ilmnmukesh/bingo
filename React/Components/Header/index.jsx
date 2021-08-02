const Header=()=>{
    let colors=["red-text", "purple-text", "cyan-text", "yellow-text", "green-text"]
    return (
        <div className="h3 text-center pt-md-5 pt-3" style={{"font-family": `'Source Code Pro', monospace`}}>
            {"Bingo".split("").map((e, i)=>{
                return (<span className={colors[i]+" px-2 "} >{e}</span>)
            })}
        </div>
    )
}