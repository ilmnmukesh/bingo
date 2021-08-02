const Center =(props)=>{

    return (
        <div className="col-md-6 text-center pt-3" style={{"font-family": `'Source Code Pro', monospace`}} >
            <Board {...props}/>
        </div>
    )
}