export const colors = {
    white: '#ffffff',
    grey: '#AAAAAA',
    darkgrey: '#555555',
    blue: '#5555FF',
    darkblue:'#0000AA',
    green:'#55FF55',
    darkgreen:'#00AA00',
    red:'#FF5555',
    darkred: '#AA0000',
    yellow:'#FFFF55',
    black:'#000000',
    purple:'#FF55FF',
    brown:'#AA5500'
}

export default {
    window: {
        background: '#f3f3f3',
        borderRadius: '5px',
        border: '1px solid'
    },
    buttonOuter: {
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        background:colors.black,
        width:'50%',
        marginLeft:'calc(50% - 0.5em)',
        padding:'2px'
    },
    buttonInner: {
        border:'1px solid', paddingLeft:'5px', paddingRight:'5px' ,
        background:'black',
        cursor:'pointer',
        textAlign:'center' as 'center',
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
        border: '7px double '+colors.green,
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