const LeaderBoard=(props)=>{
    const {server,userId,db, score, setIsStart,setIsComplete}=props
    const [data, setData]=React.useState([])
   
    React.useEffect(()=>{
        db.ref(server).once("value", (e)=>{
            let d= e.val()
            let sortable = d.score
            let ret=[]
            if(d.score!==undefined){
                sortable = Object.entries(d.score).sort(([,a],[,b]) => b-a)
                if(d.players!==undefined){
                    sortable.forEach(sort=>{
                        let user=d.players.find(e=>e.id===sort[0])
                        if(user!=null){
                            ret.push({
                                id:user.id,
                                name:sort[0]===userId?"You":user.name,
                                score:sort[1]
                            })
                        }
                    })
                }
            }
                
            setData(ret)      
        })
    }, [])
    return (
        <div className="offset-2 mt-2 pt-5 text-center col-8" style={{"font-family": `'Source Code Pro', monospace`}} >
            <p>LeaderBoard</p>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">Player</th>
                        <th scope="col">Name</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((e, i)=>(
                            <tr>
                                <th scope="row">{i+1}</th>
                                <td>{e.name}</td>
                                {
                                    
                                    score[e.id]===undefined || score[e.id]===0 
                                    ?
                                    <td>+{e.score}</td>
                                    :
                                    <td>{score[e.id]}+{e.score-score[e.id]}</td>

                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div>
                <button className="btn btn-sm btn-danger" onClick={()=>{
                    setIsComplete(false)
                    setIsStart(false)
                }}>Next</button>
            </div>
        </div>
    )
}