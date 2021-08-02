const Theme=({setTheme})=>{
    let sound=new Sound()
    return (
        <div className="row mt-3 justify-content-center">
            <ColorButton color="pink" click={()=>{
                sound.play("changeColor")
                setTheme({text:"  pink-text ",active:" pink border-white white-text", border:""})
            }}/>
            <ColorButton color="purple" click={()=>{
                sound.play("changeColor")
                setTheme({text:" border-secondary purple-text ",active:" purple  border-white white-text", border:"border-secondary"})}
            }/>
            <ColorButton color="red" click={()=>{
                sound.play("changeColor")
                setTheme({text:" border-danger text-danger ",active:" bg-danger  border-white white-text", border:"border-danger"})}
            }/>
            <ColorButton color="yellow" click={()=>{
                sound.play("changeColor")
                setTheme({text:" border-warning text-warning ",active:" border-dark yellow text-dark", border:"border-warning"})}
            }/>
            <ColorButton color="cyan" click={()=>{
                sound.play("changeColor")
                setTheme({text:" border-info cyan-text ",active:" cyan  border-white white-text", border:"border-info"})}
            }/>
            <ColorButton color="green" click={()=>{
                sound.play("changeColor")
                setTheme({text:" border-success text-success ",active:" bg-success  border-white white-text", border:"border-success"})
            }}/>
        </div>
    )
}