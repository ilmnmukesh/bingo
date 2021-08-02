const Theme=({setTheme})=>{
    return (
        <div className="row mt-3 justify-content-center">
            <ColorButton color="pink" click={()=>{setTheme({text:"  pink-text ",active:" pink border-white white-text", border:""})}}/>
            <ColorButton color="purple" click={()=>{setTheme({text:" border-secondary purple-text ",active:" purple  border-white white-text", border:"border-secondary"})}}/>
            <ColorButton color="red" click={()=>{setTheme({text:" border-danger text-danger ",active:" bg-danger  border-white white-text", border:"border-danger"})}}/>
            <ColorButton color="yellow" click={()=>{setTheme({text:" border-warning text-warning ",active:" border-dark yellow text-dark", border:"border-warning"})}}/>
            <ColorButton color="cyan" click={()=>{setTheme({text:" border-info cyan-text ",active:" cyan  border-white white-text", border:"border-info"})}}/>
            <ColorButton color="green" click={()=>{setTheme({text:" border-success text-success ",active:" bg-success  border-white white-text", border:"border-success"})}}/>
        </div>
    )
}