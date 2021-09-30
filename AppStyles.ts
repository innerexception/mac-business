export const colors = {
    white: '#f3f3f3',
    grey1: '#d5d5d5',
    grey2: '#b3b3b3',
    grey3:'#5f5f5f',
    black:'#252525'
}

export default {
    window: {
        background: '#f3f3f3',
        borderRadius: '5px',
        border: '1px solid'
    },
    buttonOuter: {
        color: '#252525', 
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        borderRadius: '5px',
        background:'white',
        width:'50%',
        marginLeft:'calc(50% - 0.5em)',
        padding:'2px'
    },
    buttonInner: {
        border:'1px solid', borderRadius: '3px', paddingLeft:'5px', paddingRight:'5px' ,
        color: '#252525', 
        background:'white',
        cursor:'pointer'
    },
    topBar: {
        background: 'white',
        display:'flex',
        justifyContent:'space-around',
        alignItems: 'center',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: '1px solid',
        height:'1em'
    },
    notification: {textAlign:'center', padding:'0.5em', border:'1px solid', borderRadius:'5px', background:'#f3f3f3', fontFamily:'Comicoro'},
    hr: {
        margin:0,
        marginBottom:'1px'
    },
    modal: {
        background:'black',
        backgroundPosition:'center',
        position:'absolute' as 'absolute',
        width: '375px',
        maxWidth: '99vw',
        display:'table',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between',
        zIndex:2,
        padding:'10px',
        border: '7px double white',
        color:'orange',
        top:'7em',
        left:'7em'
    },
    centered: {
        left:'50%', top:'50%',
        transform: 'translate(-50%, -50%)'
    },
    bottomBarContent: {
        background:' rgb(90, 90, 90)',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start',
        height: '100%',
        width:'75%'
    },
    bottomBarContentInner: {overflow:'hidden', padding:'0.5em', margin:'0.5em', background:'rgba(33, 3, 3, 0.3)', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-around'},
    notifications: {
        position:'absolute' as 'absolute',
        left:0, bottom:0,
        maxWidth: '80vw',
        height: '5em',
        display:'flex',
        zIndex:2
    },
    close: {
        position:'absolute' as 'absolute', right:20, top:10, cursor:'pointer', fontSize:'18px'
    },
    bounce: {
        width:'2em',
        height:'1em',
        animation: 'shake 5s',
        animationIterationCount: 'infinite'
    }
}