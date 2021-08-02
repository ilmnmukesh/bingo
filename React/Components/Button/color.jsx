const ColorButton=(props)=>{
    return (<div style={{
        border:"1px solid "+ props.color,
        height:"20px",
        borderRadius:"50%",
        "-moz-border-radius":"50%",
        "-webkit-border-radius":"50%",
        width:"20px"
    }} className={" shadow mx-md-2 mx-1 " + props.color} onClick={props.click}>
    </div>)
}