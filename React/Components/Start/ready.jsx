const Ready=(props)=>{
    let sound = new Sound()
    const {server, setServer,setIsReady, userId, setLen, setIsStart} = props//{server:"27775", userId:props.userId===""?"b2jp8":props.userId}
    const [nop, setNop]= React.useState(1)
    const [username, setUsername]= React.useState("")
    const [userReady, setUserReady]=React.useState(false)
    const [playerDetails, setPlayerDetails]=React.useState([])
    const changeName=()=>{
        let db= firebase.database()
        db.ref(server+"/players").once("value", e=>{
            let players= e.val()
            let user=players.find(e=>e.id===userId)
            
            if(user!==-1 && user!==undefined){
                user.name=username
                sound.play("changeName")
                db.ref(server+"/players").set(players)
            }                           
        })
    }
    const toggleStatus=()=>{
        let db= firebase.database()
        db.ref(server+"/players").once("value", e=>{
            let players= e.val()
            let user=players.find(e=>e.id===userId)
            
            if(user!==-1 && user!==undefined){
                user.ready=!user.ready
                setUserReady(user.ready)
                sound.play("btnChange")
                db.ref(server+"/players").set(players)
            }                           
        })
    }
    const playerTheme=(theme, active)=>{
        let db= firebase.database()
        db.ref(server+"/players").once("value", e=>{
            let players= e.val()
            let user=players.find(e=>e.id===userId)
            
            if(user!==-1 && user!==undefined){
                user.color=theme  
                user.activeColor= active              
                sound.play("changeColor")
                db.ref(server+"/players").set(players)
            }                           
        })
    }
    React.useEffect(()=>{
        if(server!==""){
            let db= firebase.database()
            let serRef=db.ref(server)
            let cntRef=db.ref(server+"/player_count")
            let playerChangeRef=db.ref(server+"/players")
            let playerAddedRef= db.ref(server+"/players")
            let playerDeleteRef= db.ref(server+"/players")

            serRef.once("value", (e)=>{
                let data=e.val()
                if(data!==undefined){
                    if(data.player_count!==undefined){
                        setNop(data.player_count.count)
                    }
                    if(data.players!==undefined){
                        setPlayerDetails(data.players)
                        let user=data.players.find(e=>e.id==userId)
                        
                        if(user!==-1 && user!==undefined){
                            setUsername(user.name)
                            setUserReady(user.ready)
                        }                            
                   }
                }
            })            
            
            cntRef.on("child_changed", (e)=>{
                setNop(e.val())
            })
            
            playerChangeRef.on("child_changed", (_)=>{
                db.ref(server+"/players").once("value", (e)=>{
                    let data=e.val()
                    let ready = true
                    data.forEach(i=>{
                        if(!i.ready) ready=false
                    })
                    if(data.length>1 && ready){
                        data.forEach(i=>{
                            i["start"]=true
                        })
                        db.ref(server+"/score/"+userId).once("value", sc=>{
                            if(sc.val()===null){
                                db.ref(server+"/score/"+userId).set(0)
                            }                            
                        })
                        let length=data.length
                        if(length<=3){
                            length=5
                        }else{
                            length=length+2
                        }
                        setLen(length)
                        db.ref(server+"/entries").set(false)
                        db.ref(server+"/turn").set({current:data[0].id})
                        db.ref(server+"/players").set(data)
                        sound.play("start")
                        setIsStart(true)
                    }else{
                        if(_.val()!==null && _.val().id!==userId)
                            sound.play("changeName")
                    }
                    
                    setPlayerDetails(data)
                })            
            })
            
            playerAddedRef.on("child_added", (_)=>{
                
                db.ref(server+"/players").once("value", (e)=>{
                    setPlayerDetails(e.val())
                    if(_.val()!==null && _.val().id!==userId){
                        sound.play("add")
                    }                    
                })            
            })
            
            playerDeleteRef.on("child_removed", (_)=>{
                db.ref(server+"/players").once("value", (e)=>{
                    sound.play("left")
                    if(e.val()!==undefined && e.val()!==null && e.val().length>0)
                        setPlayerDetails(e.val())
                    else{
                        setPlayerDetails([])
                    }
                })            
            })

            return ()=>{
                playerAddedRef.off("child_added")
                cntRef.off("child_changed")
                playerChangeRef.off("child_changed")
                playerDeleteRef.off("child_removed")
                db.ref(server+"/players").once("value", (e)=>{
                    let data=e.val()
                    if(data!==null && data.length>0){
                        let d= data.find(e=>e.id===userId)
                        if (d!==undefined && !d.start){
                            data=data.filter(e=>e.id!==userId)
                            db.ref(server+"/player_count").once("value", (c)=>{
                                let cnt= c.val()
                                cnt.count--
                                if(cnt.count===0){
                                    db.ref(server).set({})
                                }else{
                                    db.ref(server+"/player_count").set(cnt)
                                }   
                            })
                            db.ref(server+"/players").set(data)    
                        }                        
                    }
                })
            }
        }
    }, [])
    return (
        <div className="text-center pt-2" style={{fontFamily:"'Source Code Pro', monospace"}}>
            <div>
                <p className="col-12">{server}</p>
                Number of player {nop} <br></br>
                {
                    userReady?
                        <button onClick={toggleStatus} className="btn btn-sm btn-outline-grey">
                            Wait<i class="fa fa-play ml-2" aria-hidden="true"></i>
                        </button>
                    :
                        <button onClick={toggleStatus} className="btn btn-sm btn-grey">
                            Ready<i class="fa fa-play ml-2" aria-hidden="true"></i>
                        </button>

                }
                <button onClick={()=>{
                    setIsReady(false)
                    sound.play("back")
                    setServer("")
                }} className="btn btn-sm btn-danger">
                    <i class="fa fa-arrow-left mr-2"></i>Back
                </button>
            </div>
            <div className='pt-3 container col-8 col-md-4 col-lg-3'>
                <div class="md-form text-center m-0 ">
                    <input class="form-control" autoFocus  maxLength={15} onKeyDown={(e)=>{
                        if(e.key=="Enter"){
                            changeName()
                        }
                    }} onChange={e=>setUsername(e.target.value)} name="code" type="text" value={username}/>
                    <label class="text-center border-0">Your Name</label>
                </div>     
                <button onClick={changeName} className="btn btn-sm btn-purple">
                <i class="fa fa-bomb mr-2" aria-hidden="true"></i>
                Change Name</button>
                                          
            </div>
            {
                playerDetails.map((e, i)=>(
                    <div className="m-0 p-0 mt-2">
                        <div className={"btn btn-sm  "+(e.ready?e.activeColor:e.color)}>Player{i+1}: {e.name}{e.ready ?"(ready)":""}</div>
                    </div>
                    
                ))
            }
            
            <div className="row mt-3 justify-content-center">
                <ColorButton color="pink" click={()=>playerTheme("btn-outline-pink", "btn-pink")}/>
                <ColorButton color="purple" click={()=>playerTheme("btn-outline-purple", "btn-purple")} />
                <ColorButton color="red" click={()=>playerTheme("btn-outline-danger", "btn-danger")}/>
                <ColorButton color="yellow" click={()=>playerTheme("btn-outline-warning", "btn-warning")} />
                <ColorButton color="cyan" click={()=>playerTheme("btn-outline-cyan", "btn-cyan")}/>
                <ColorButton color="green" click={()=>playerTheme("btn-outline-success", "btn-success")}/>
            </div>
        </div>
    )
}