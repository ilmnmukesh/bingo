const Right = ({server, userId})=>{
    const [history, setHistory]=React.useState([])
    const [players, setPlayers]=React.useState({})
    React.useEffect(()=>{
        let db=firebase.database()
        let historyRef=db.ref(server+"/history")
        db.ref(server+"/players").once("value",(e)=>{
            let pl=e.val()
            let data={}
            if(pl!== null){
                pl.forEach((p)=>{
                    data[p.id]=p.name
                })
            }
            setPlayers(data)            
        })
        historyRef.on("child_added", (e)=>{
            let a=e.val()
            if(a.id===userId){
                let sound=new Sound()
                sound.play("history")
            }
            setHistory(history=>{
                let hist=history
                hist.splice(0, 0, a)
                return [...hist]
            })
        })
        return ()=>{
            historyRef.off("child_added")
        }
    }, [])
    return (
        <div className="col-md-3 text-center" style={{"font-family": `'Source Code Pro', monospace`}}>
            <div>
                History
            </div>
            <div className="history-contaniner" style={{overflowY:"scroll"}}>
                {history.map((e)=>(
                <div>
                    {e.id===userId?"You":players[e.id]} choose {e.pressed}
                </div>
                ))}
            </div>
        </div>
    )
}