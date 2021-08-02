const Left = (props)=>{
    let sound = new Sound()
    const {len, server, db ,userId, setWait}=props
    const [data, setData]=React.useState([])
    const [nop, setNop]= React.useState(1)
    const [turn, setTurn]= React.useState("")
    const [currentTurn, setCurrentTurn]= React.useState({})
    React.useEffect(()=>{
        if(server!==""){
            db.ref(server).once("value", (e)=>{
                let data=e.val()
                if(data!==undefined && data !== null){
                    if(data.player_count!==undefined && data.player_count !==null && data.player_count.count !==undefined)
                        setNop(data.player_count.count)
                    if(data.players!==undefined && data.players !== null){
                        setData(data.players)
                        if(data.turn!==undefined && data.turn!==null && data.turn.current!==undefined && data.turn.current!==null){
                            setTurn(data.turn.current)
                            if(data.turn.current===userId){
                                setWait(false)
                            }else{
                                setWait(true)
                            }
                            data.players.forEach((e, i)=>{
                                if(e.id===data.turn.current){
                                    setCurrentTurn({...e, index:i})
                                }
                            })
                        }
                    }
                    
                }            
            })
            let cntRef=db.ref(server+"/player_count")
            let playerChangeRef=db.ref(server+"/players")
            let playerAddedRef= db.ref(server+"/players")
            let playerDeleteRef= db.ref(server+"/players")
            let turnRef= db.ref(server+"/turn")
            cntRef.on("child_changed", (e)=>{
                setNop(e.val())
            })
            turnRef.on("child_changed", (e)=>{
                if(e.val()===userId){
                    sound.play("yourTurn")
                    setWait(false)
                }else{
                    setWait(true)
                }
                
            
                setData(p=>{
                    p.forEach((d, i)=>{
                        if(d.id===e.val()){
                            setCurrentTurn({...d, index:i})
                        }
                    })
                    return p 
                })
                setTurn(e.val())
                
            })
            playerChangeRef.on("child_changed", (_)=>{
                db.ref(server+"/players").once("value", (e)=>{
                    setData(e.val())
                })            
            })
            
            playerAddedRef.on("child_added", (_)=>{
                db.ref(server+"/players").once("value", (e)=>{
                    setData(e.val())
                })            
            })
            
            playerDeleteRef.on("child_removed", (_)=>{
                db.ref(server+"/players").once("value", (e)=>{
                    if(_.val()!==null && _.val().id!==userId){
                        sound.play("left")
                    }    
                    if(e.val()!==undefined && e.val()!==null && e.val().length>0)
                        setData(e.val())
                    else{
                        setData([])
                    }
                })            
            })

            return ()=>{
                playerAddedRef.off("child_added")
                cntRef.off("child_changed")
                turnRef.off("child_changed")
                playerChangeRef.off("child_changed")
                playerDeleteRef.off("child_removed")
            }
        }
        
    }, [])
    return (
        <div className="col-md-3 text-center pt-3" style={{"font-family": `'Source Code Pro', monospace`}} >
            <div className="d-md-block d-none">
                <div>
                    No of Player: {nop}/{len}
                </div>
                {
                    data.map((e, i)=>(
                        <div className="m-0 p-0 mt-2">
                            <div className={"btn btn-sm  "+(e.id===turn?e.color:e.activeColor)}>
                                {
                                    e.id===turn?
                                    <i class="fa fa-play mr-2" aria-hidden="true"></i>
                                    :
                                    <i class="fa fa-user mr-2" aria-hidden="true"></i>
                                }
                                Player{i+1}: {e.name}
                            </div>
                        </div>
                        
                    ))
                }
                
            </div>
            {
                currentTurn!==undefined && currentTurn.id!==userId ?
                <div>
                    <div className="mt-md-3 text-center">
                        <div className="row mt-0">
                            <div className="col-8 text-right">
                                Current Turn:
                            </div>
                            <div className="col-3 text-left">
                                <div class="three-dot p-0 text-left">
                                    <div class="bounce1 grey"></div>
                                    <div class="bounce2 grey"></div>
                                    <div class="bounce3 grey"></div>
                                </div>
                            </div>
                        </div>
                        <div className="m-0 p-0 mt-1">
                            <div className={"btn btn-sm "+(currentTurn.activeColor !==undefined?currentTurn.activeColor:"")}>
                                <i class="fa fa-play mr-2" aria-hidden="true"></i>
                                Player{currentTurn.index !==undefined?currentTurn.index:""}: {currentTurn.name !==undefined ?currentTurn.name:""}
                            </div>
                        </div>
                    </div>
                </div>
            :<div>
                <div className="mt-md-3 text-center">
                    <div>Current Turn:</div><br></br>
                    <div>Your Turn</div>
                </div>
            </div>
            }
        </div>
    )
}