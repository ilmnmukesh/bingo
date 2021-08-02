const Board=(props)=>{
    const {theme, setTheme}=props
    const [numbers, setNumbers]=React.useState([])
    const {len,setIsComplete, server, userId,  setScore}=props
    const [wd, setWd]=React.useState(window.innerWidth>=400? 400 : window.innerWidth - 60)
    const {wait, setWait}=props
    const {count, setCnt}=props
    const ActiveUpdateDb=(val)=>{
        let db=firebase.database()
        db.ref(server).once("value", e=>{
            let data=e.val()
            let next=""
            let nextIndex=-1
            if(data.players!==undefined && data.players!==null &&data.players.length>0){
                nextIndex=data.players.findIndex(e=>e.id==userId)
                if(nextIndex!==-1){
                    nextIndex++
                    if(nextIndex>=data.players.length){
                        nextIndex=0
                    }
                    next=data.players[nextIndex].id
                }
                
            }

            if(data.history ===undefined){
                data.history=[{
                    id:userId,
                    pressed:val,
                    next:next,
                    nextIndex:nextIndex,
                    finish:false
                }]
            }else{
                data.history.push({
                    id:userId,
                    pressed:val,
                    next:next,
                    nextIndex:nextIndex,
                    finish:false
                })
            }
            if(data.turn !==undefined && data.turn.current!==undefined){
                data.turn.current=next
            }
            setWait(true)
            db.ref(server).set(data)
        })
    }
    const ActiveState=(val)=>{
        if(wait){
            return
        }
        if(!wait && count>=5){
            return
        }
        let num=[...numbers]
        num.forEach(e=>{
            e.forEach(m=>{
                if(m.value== val && !m.active){
                    m.active= true
                    setNumbers([...num])
                    ActiveUpdateDb(val)
                }
            })
        })
        
    }
    const randomNumbers=(l)=>{
        var numb = [];
        while(numb.length < l*l){
            var r = Math.floor(Math.random() * l*l) + 1;
            if(numb.indexOf(r) === -1) numb.push(r);
        }
        return numb
    }
    
    const checkBackgroundStrike=(ele)=>{
        let str=""
        if(ele.xAxis){
            str+=`linear-gradient(to top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`
        }
        if(ele.yAxis){
            if(str===""){
                str+=`linear-gradient(to right, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`
            }else{
                str+=`,linear-gradient(to right, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`
            }
        }
        if(ele.forward){
            if(str===""){
                str+=`linear-gradient(to left top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`
            }else{
                str+=`,linear-gradient(to left top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`
            }
        }
        if(ele.backward){
            if(str==="")
                str+=`linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`
            else
                str+=`,linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)`            
        }
        return str
    }
    React.useEffect(()=>{
        const updateWindowDimensions = () => {
            setWd(window.innerWidth>=400? 400 : window.innerWidth - 60)
        }
        window.addEventListener("resize", updateWindowDimensions);
        return () => window.removeEventListener("resize", updateWindowDimensions) 
    }, [])
    React.useEffect(()=>{
        let numb = randomNumbers(len)
        let db= firebase.database()
        setTimeout(()=>{
            db.ref(server+"/score").once("value", sc=>{
                setScore(sc.val())
            })
        }, 5000)
        db.ref(server+"/details/"+userId).once("value", e=>{
            let d= e.val()
            if(d===undefined || d===null){
                let arr=[]
                let temp=[]
                numb.forEach((x, i)=>{
                    let data={
                        value:x,
                        active:false,
                        xAxis:false,
                        yAxis:false,
                        forward:false,
                        backward:false
                    }
                    temp.push(data)
                    if((i+1)%len ===0){
                        arr.push([...temp])
                        temp=[]
                    }
                })
                setNumbers([...arr])
                
                db.ref(server+"/details/"+userId).set(arr)
            }else{
                setNumbers(d)
            }
        })
        
    }, [])
    React.useEffect(()=>{
        const checkStrike=()=>{
            let data=[...numbers]
            let cnt= 0
            if(data.length===0 ){
                return
            }
            let diagonalForward=true
            let diagonalBackward=true
            for(let i=0;i<len;i++){
                let checkX=true
                let checkY=true
                if(!data[i][len-i-1].active){
                    diagonalForward=false
                }           
    
                if(!data[i][i].active){
                    diagonalBackward=false
                }           
    
                for(let x=0;x<len;x++){
                    if(!data[i][x].active){
                        checkX=false
                        break
                    }
                }
                for(let x=0;x<len;x++){
                    if(!data[x][i].active){
                        checkY=false
                        break
                    }
                }
                if(checkX){
                    cnt+=1
                    for(let x=0;x<len;x++){
                        data[i][x].xAxis=true
                    }
                }
                
                if(checkY){
                    cnt+=1
                    for(let x=0;x<len;x++){
                        data[x][i].yAxis=true
                    }
                }
            }
            if(diagonalForward){
                cnt+=1
                for(let x=0;x<len;x++){
                    data[x][len-x-1].forward=true
                }
            }
            
            if(diagonalBackward){
                cnt+=1
                for(let x=0;x<len;x++){
                    data[x][x].backward=true
                }
            }
            return cnt
        }
        setCnt(checkStrike())
    }, [numbers])

    React.useEffect(()=>{
        if(count>=5){
            let db = firebase.database()
            db.ref(server+"/history").once("value", hist=>{
                let history= hist.val()
                if(history!==null && history.length>0){
                    history.push({
                        id:userId,
                        pressed:"Winning",
                        next:userId,
                        nextIndex:0,
                        finish:true
                    })
                    db.ref(server+"/history").set(history)
                    setCnt(cnt=>{
                        db.ref(server+"/score/"+userId).once("value", c=>{
                            let data = c.val()
                            let score =data===null?0:data
                            if(cnt>=5){
                                score += 75
                            }else{
                                score += cnt*10
                            }
                            db.ref(server+"/score/"+userId).set(score)
                            
                        })
                        return cnt
                    })
                }
                
            })
        }
    }, [count])
    React.useEffect(()=>{
        let db = firebase.database()
        let historyRef= db.ref(server+"/history")
        historyRef.on("child_added", (e)=>{
            if(e.val().finish){
                setCnt(cnt=>{
                    db.ref(server+"/score/"+userId).once("value", c=>{
                        let data = c.val()
                        let score =data===null?0:data
                        if(cnt==5){
                            score += 75
                        }else{
                            score += cnt*10
                        }
                        db.ref(server+"/score/"+userId).set(score)
                        db.ref(server+"/details").set({})
                        db.ref(server+"/history").set({})
                        db.ref(server+"/players").once("value",p=>{
                            let players=p.val()
                            if(players!==null){
                                players.forEach(player=>{
                                    player.ready=false
                                    player.start=false
                                })
                                db.ref(server+"/players").set(players)
                            }                            
                        })
                        db.ref(server+"/entries").set(true)
                        setWait(true)
                        setIsComplete(true)
                    })
                    return cnt
                })
            }else{
                setNumbers(prev=>{
                    let n = [...prev]
                    for(let i=0;i<n.length;i++){
                        for(let j=0;j<n[i].length;j++){
                            if(e.val().pressed===n[i][j].value){
                                n[i][j].active=true
                            }
                        }
                    }
                    db.ref(server+"/details/"+userId).set(n)
                    return n
                })
            }
        })
        return()=>{
            historyRef.off("child_added")
        }
    }, [])
    

    const RenderData=(
        <div  >
                {
                    numbers.map(arr=>(
                            <div className="row justify-content-center">
                                {
                                    arr.map(ele=>(
                                        <div 
                                            className={"border shadow "+theme.text + (ele.active?theme.active:"" )}
                                            style={{
                                                width:wd/len, 
                                                height:wd/len, 
                                                justifyContent: "center",
                                                alignItems: "center",
                                                display: "flex",
                                                background:checkBackgroundStrike(ele)
                                            }}
                                            onClick={()=>ActiveState(ele.value)}    
                                        >
                                            {wd>=400? <h3>{ele.value}</h3>: <h6>{ele.value}</h6>}
                                        </div>
                                        )
                                    )
                                
                                }
                            </div>
                        )
                    )
                }
            </div>
    )
    return (
        <div className="col-12 m-0 p-0 text-center">
            {RenderData}
            <Theme setTheme={setTheme}></Theme>
            <BingoKey count={count} theme={theme}/>
        </div>
    )
}
