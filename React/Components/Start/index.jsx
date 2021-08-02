const Start=(props)=>{
    let sound=new Sound()
    const [joinCreate, setJoinCreate]= React.useState(true)
    const {server, setServer, setIsReady, setUserId} = props
    const [code, setCode]=React.useState("")
    const [generateLoading, setGenerateLoading]= React.useState(false)
    const [connectLoading, setConnectLoading]=React.useState(false)
    const [err, setErr]=React.useState("")

    const connectServer=()=>{        
        setErr("")
        if(code==null || code==""){
            sound.play("error")
            return
        }
        
        setConnectLoading(true)
        if(code.length!=5){
            setErr("Code must be 5 character")
            setConnectLoading(false)
            sound.play("error")
            return
        }
        let db=firebase.database()
        db.ref(code).once("value",(s)=>{
            if(s.exists()){
                setErr("Got it")
                db.ref(code).once("value", e=>{
                    let data=e.val()
                    if(data.entries ===undefined){
                        setErr("No Server Exists")
                        setConnectLoading(false)
                        sound.play("error")
                        return 
                    } if(!data.entries){
                        setErr("Wait for Others to finish")
                        sound.play("error")
                        setConnectLoading(false)
                        return
                    }
                    if(data!==undefined && data.player_count!==undefined && data.player_count!==undefined)
                        data.player_count.count++
                    let id = (Math.random() + 1).toString(36).substring(7)
                    let pl={
                        id:id,
                        name:"Player_"+id, 
                        ready:false, 
                        start:false, 
                        color:"btn-outline-pink", 
                        activeColor:"btn-pink"
                    }
                                        
                    if(data.players!==undefined)
                        data.players.push(pl)
                    else data.players=[pl]
                    setUserId(id)
                    db.ref(code).set(data)
                    sound.play("connect")
                    setServer(code)
                    setIsReady(true)
                    setConnectLoading(false)
                })
            }else{
                setErr("Invalid Code")
                sound.play("error")
                setConnectLoading(false)
            }
        })
    }
    const generate=()=>{
        setGenerateLoading(true)
        let db=firebase.database()
        let code=Math.floor(Math.random()*90000) + 10000
        //let code = 99999
        let id = (Math.random() + 1).toString(36).substring(7)
        let uc={
            user_created:id, 
            entries:true,
            turn:{
                current:id
            },
            players:[{
                    id:id,
                    name:"Player_"+id, 
                    ready:false, 
                    start:false, 
                    color:"btn-outline-pink", 
                    activeColor:"btn-pink"
                }],
            player_count:{
                count:1
            }
        }
        db.ref(code.toString()).set(uc)
        setServer(code.toString())
        setUserId(id)
        sound.play("generate")
        setIsReady(true)
    }
    return (
        <div className="text-center" style={{fontFamily:"'Source Code Pro', monospace"}}>
            <div>
                Play with Friends
            </div>
            <div className="text-center pt-5">
                <div className="pt-5" >
                    <button onClick={()=>{
                        if(joinCreate){
                            sound.play("error")
                        }else{
                            sound.play("btnChange")
                        }
                        setJoinCreate(true)
                    }}
                        className={`btn btn-md ${joinCreate?"btn-danger":"btn-outline-danger" }`}
                    >Join</button>
                    <button onClick={()=>{
                        if(joinCreate){
                            sound.play("btnChange")
                        }else{
                            sound.play("error")
                        }
                        setJoinCreate(false)
                    }}
                        className={`btn btn-md ${joinCreate?"btn-outline-info":"btn-info" }`}
                    >Create</button>
                </div>
            </div>
            <div className={joinCreate?"pt-5 container col-8 col-md-4 col-lg-3":"d-none"} style={{fontFamily:"'Source Code Pro', monospace"}}>
                <div class="md-form text-center m-0">
                    <input class="form-control" maxLength={5} onKeyDown={(e)=>{
                        if(e.key=="Enter"){
                            connectServer()
                        }
                    }} onChange={e=>setCode(e.target.value)} name="code" type="text" required/>
                    <label class="text-center border-0">Enter Code</label>
                    <small class="text-danger">
                        {
                            connectLoading
                            ?
                            <div class="spinner-border text-secondary" role="status" style={{width:25, height:25}}>
                                <span class="visually-hidden"></span>
                            </div>
                            :
                            err
                        }
                    </small>
                </div>
                <div class="mt-md-5">
                    <button onClick={connectServer} type="submit" class="btn-rounded btn btn-outline-grey btn-block my-4 waves-effect">Connect</button>
                </div>
            </div>
            <div className={!joinCreate?"pt-5 container col-8 col-md-4 col-lg-3":"d-none"} style={{fontFamily:"'Source Code Pro', monospace"}}>
                <div class="text-center">
                    <p class="col-12">{server}</p>
                    <button disabled={server!=""}
                    onClick={generate} class="btn-rounded btn btn-outline-grey btn-block my-4 waves-effect">Generate</button>
                </div>
                {
                    generateLoading
                    ?
                    <div className="text-center">
                        <h6 className="mb-3">Wait for opponent</h6>
                        <div class="spinner-border text-secondary" role="status">
                            <span class="visually-hidden"></span>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>
                
        </div>
    )
}