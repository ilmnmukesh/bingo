const LeaderBoard=(props)=>{
    const {server,userId,db, score, setIsStart,setIsComplete}=props
    const [data, setData]=React.useState([])
   
    React.useEffect(()=>{
        let sound = new Audio('../static/audio/victoryMusic.ogg')
        if(audioPlay)
            sound.play()
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
        Number.prototype.format = function(n) {
            var r = new RegExp('\\d(?=(\\d{3})+' + (n > 0 ? '\\.' : '$') + ')', 'g');
            return this.toFixed(Math.max(0, Math.floor(n))).replace(r, '$&,');
        };
        
        return ()=>{
            sound.pause()
            sound.currentTime=0
        }
    }, [])
    React.useEffect(()=>{
        if(data.length>0){
            $('.count').each(function () {
                $(this).prop('counter', 0).animate({
                    counter: $(this).text()
                }, {
                    duration: 7500,
                    easing: 'easeOutExpo',
                    step: function (step) {
                        $(this).text('' + step.format());
                    }
                });
            });
        }
    }, [data])
    return (
        <div className="mt-2 pt-5 text-center" style={{"font-family": `'Source Code Pro', monospace`}} >
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
                                    <td>+<span className="count">{e.score}</span></td>
                                    :
                                    <td>{score[e.id]}+<span className="count">{e.score-score[e.id]}</span></td>

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