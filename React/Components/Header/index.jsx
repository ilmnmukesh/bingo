const Header=()=>{
    let colors=["red-text", "purple-text", "cyan-text", "yellow-text", "green-text"]
    const [str, setStr]= React.useState("Bingo")
    const changeAudio=()=>{
        audioPlay=false
        setStr("BingØ")
    }
    const changeAudioTrue=()=>{
        audioPlay=true
        setStr("Bingo")
    }
    return (
        <div className="h3 text-center pt-md-5 pt-3" style={{"font-family": `'Source Code Pro', monospace`}}>
            {str.split("").map((e, i)=>{
                if(e==='o'){
                    return (<span className={colors[i]+" px-2 "} onClick={changeAudio} >{e}</span>)    
                }
                if(e==="Ø"){
                    return (<span className={colors[i]+" px-2 "} onClick={changeAudioTrue} >{e}</span>)    
                }
                return (<span className={colors[i]+" px-2 "} >{e}</span>)
            })}
            {/* <span className="grey-text small">            
                <i class="fa fa-volume-off" aria-hidden="true"></i>
                 <i class="fa fa-volume-up"></i>
            </span> */}
        </div>
    )
}