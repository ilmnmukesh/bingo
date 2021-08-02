
const App=()=>{
    const [theme, setTheme]=React.useState({
        text:" pink-text ",
        active:" pink white-text",
        border:""
    })
    let db= firebase.database()
    const [count, setCnt]=React.useState(0)
    const [numbers, setNumbers]=React.useState([])
    const [len, setLen]=React.useState(5)
    const [server, setServer]=React.useState("")
    const [userId, setUserId]=React.useState("")
    const [isStart, setIsStart]=React.useState(false)
    const [isReady, setIsReady]=React.useState(false)
    const [wait, setWait]=React.useState(false)
    const [isComplete, setIsComplete]=React.useState(false)
    const [score, setScore]=React.useState({})
    React.useEffect(()=>{
        window.addEventListener("beforeunload", (e)=>{
            e.preventDefault()
            localStorage.setItem("u",[server, userId])
            let db=firebase.database()
            db.ref(server+"/players").once("value", (e)=>{
                let data=e.val()
    
                if(data!==null && data.length>0){
                    let d= data.find(e=>e.id===userId)
                    if (d!==undefined && d!==null){
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
        })
    }, [server, userId])
    React.useEffect(()=>{

    })
    return (
        <div>
            <Header/>
            {
                isStart?
                (   isComplete
                    ?
                    <LeaderBoard server={server } score={score} db={db} userId={userId} setIsComplete={setIsComplete}   setIsStart={setIsStart} />
                    :
                    <div className="row">
                        <Left setWait={setWait} len={len} setLen={setLen} server={server } db={db} userId={userId} setCnt={setCnt}/>
                        <Center wait={wait}  setScore={setScore} setWait={setWait} userId={userId} theme={theme} setTheme={setTheme} setIsComplete={setIsComplete} count={count} setCnt={setCnt} numbers={numbers} setNumbers={setNumbers} len={len} server={server} setLen={setLen}/>
                        <Right/>
                    </div>
                )
                :(
                    isReady?
                    <Ready  server={server} setServer={setServer} userId={userId} setIsReady={setIsReady}  setIsStart={setIsStart} />
                    :
                    <Start server={server} setServer={setServer} setIsReady={setIsReady} setUserId={setUserId}/>      
                )
            }
        </div>
    )
}

ReactDOM.render( <App/> , document.querySelector('#app'));