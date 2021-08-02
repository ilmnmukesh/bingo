const BingoKey = ({count, theme})=>{
    let colors=["red-text", "purple-text", "cyan-text", "yellow-text", "green-text"]
    let colorsActive=["red", "purple", "cyan", "yellow", "green"]
    React.useEffect(()=>{
        if(count>=1){    
            let sound=new Sound()
            sound.play("score")
        }
    }, [count])
    return (
        <div className="h3 text-center pt-3" style={{"font-family": `'Source Code Pro', monospace`}}>
            {
                "Bingo".split("").map((e, i)=>{
                    if(i<count)
                        return (<span className={colorsActive[i]+" shadow strike-bingo text-white px-2"}>{e}</span>)
                    return (<span className={colors[i]+" shadow border px-2 "+theme.border} >{e}</span>)
                })
            }
        </div>
    )
}