const Right = ()=>{
    const [cnt , setCnt]=React.useState(0)
    const [history, setHistory]=React.useState([])
    const addHistory=()=>{
        let h=history
        h.splice(0, 0, cnt)
        setCnt(cnt+1)
        setHistory([...h])
    }

    return (
        <div className="col-md-3 text-center" style={{"font-family": `'Source Code Pro', monospace`}}>
            <div>
                History
            </div>
            <div className="history-contaniner" style={{height:400, overflowY:"scroll"}}>
                {history.map((e)=>(
                <div>
                    Player1 choose {e}
                </div>
                ))}
            </div>
            <div>
                <button onClick={addHistory} className="btn btn-sm btn-purple">Add</button>
            </div>
        </div>
    )
}