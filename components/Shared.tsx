import * as React from 'react'
import AppStyles, { colors } from '../AppStyles'



export const TopBar = (text:string|JSX.Element) => 
    <div style={AppStyles.topBar}>
        <div style={{width:'33%'}}><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/></div>
            {text}
        <div style={{width:'33%'}}><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/></div>
    </div>

export const Button = (enabled:boolean, handler:Function, text:JSX.Element | string) => 
    <div onClick={enabled? ()=>handler() : null} style={{...AppStyles.buttonInner}}><span style={{opacity: enabled ? 1 : 0.5}}>{text}</span></div>

export const ToggleButton = (state:boolean, handler:any, text:JSX.Element | string) => 
    <div style={{...AppStyles.buttonOuter, color:state ? 'white' : 'black', background:state?'black':'white'}} 
        onClick={handler}>
        <div style={{...AppStyles.buttonInner}}>{text}</div>
    </div>

export const RangeSpinner = (value:number, onValueChange:Function, leftLabel:string, rightLabel:string, disabled:boolean, max:number, min:number, inc:number) =>
    <div style={{display:'flex', justifyContent:'space-between', opacity: disabled ? '0.5' : '1'}}>
        <h5 style={{width:rightLabel ? '25%' : '33%', textAlign:'left', marginRight:'5px'}}>{leftLabel}</h5>
        <div style={{width:rightLabel?'50%' : '66%', display:'flex'}}>
            <div onClick={()=>onValueChange(value-inc)} style={{pointerEvents:value >= min ? 'all' : 'none'}}>{'<'}</div>
            <div style={{border:'3px ridge', position:'relative', width:'100%'}}>
                <div style={{position:'absolute', top:0,left:0, width: ((value/max)*100)+'%', background:'white'}}/>
            </div>
            <div onClick={()=>onValueChange(value+inc)} style={{pointerEvents:value <= max ? 'all' : 'none'}}>{'>'}</div>
        </div>
        <h5 style={{width:rightLabel ? '25%' : 0, textAlign:'right', marginLeft:'5px'}}>{rightLabel}</h5>
    </div>

export const LightButton = (enabled:boolean, handler:any, text:string, tab?:boolean) => 
    <div onClick={handler} style={{...AppStyles.buttonInner, opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'all' : 'none', 
        textAlign:'center', borderBottom: tab && !enabled ? '1px dashed':'1px solid', borderBottomLeftRadius: tab?0:'3px', borderBottomRightRadius:tab?0:'3px', marginBottom: tab ? '-1px' : 0}}>{text}</div>

// export const Warning = (handler:any, icon:string, color:string) => 
//     <div onClick={handler} style={{...AppStyles.buttonInner, ...AppStyles.bounce, backgroundColor:color, color:'red', position:'absolute', top:-35, right:10, border:'none' }}>{Icon(icon, '')}!</div>
    
export const RangeInput = (value:number, onValueChange:Function, leftLabel:JSX.Element | string, rightLabel?:JSX.Element | string, disabled?:boolean, max?:number, min?:number, inc?:number) => 
    <div style={{display:'flex', justifyContent:'space-between', opacity: disabled ? '0.5' : '1'}}>
        {leftLabel && <h5 style={{textAlign:'left', marginRight:'5px', width:'20%'}}>{leftLabel}</h5>}
        <input disabled={disabled} onChange={(e)=>onValueChange(e.currentTarget.value)} style={{width: typeof rightLabel !== 'undefined' ? '60%' : '80%'}} max={max || 100} min={min || 0} step={inc || 5} type='range' value={value}/>
        {typeof rightLabel !== 'undefined' && <h5 style={{textAlign:'right', marginLeft:'5px', width:'20%'}}>{rightLabel}</h5>}
    </div>

export const NumericInput = (value:number, onValueChange:Function, max?:number, min?:number) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(min || min===0 ? value > min:true, ()=>onValueChange(value-1),'<')}
        <div style={{width:'2em', textAlign:"center"}}>{value}</div>
        {LightButton(max ? value < max:true, ()=>onValueChange(value+1),'>')}
    </div>

export const Select = (value:any, onValueChange:Function, values: Array<any>) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
        <div style={{textAlign:"center", backgroundColor:value}}>{value}</div>
        {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
    </div>

export const ColorSelect = (value:string, onValueChange:Function, values: Array<string>) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
        <div style={{backgroundColor:value, width:'2em', height:'2em'}}/>
        {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
    </div>

export const ProgressBar = (value:number, max:number, bg:string) => 
    <div style={{width:'85%', height:'10px', border:'1px solid'}}>
        <div style={{background:'url('+bg+')', width:Math.round((value/max)*100)+'%', height:'100%'}}/>
    </div>

export const CssIcon = (sheet:string, spriteIndex:number) => {
    // let backgroundImage = 'url('+ResourceTiles+')'
    // let sheetWidth = 15
    // switch(sheet){
    //     case 'buildings': 
    //         backgroundImage = 'url('+BuildingTiles+')'
    //         sheetWidth = 21
    //         break
    //     case 'wonders': 
    //         backgroundImage = 'url('+WonderTiles+')'
    //         sheetWidth = 19
    //         break
    //     case 'towns': 
    //         backgroundImage = 'url('+TownTiles+')'
    //         sheetWidth = 4
    //         break
    //     case 'improvements': 
    //         backgroundImage = 'url('+ImprovementTiles+')'
    //         sheetWidth = 4
    //         break
    //     case 'technology': 
    //         backgroundImage = 'url('+TechnologyTiles+')'
    //         sheetWidth = 10
    //         break
    // }
    // return (
    //     <div style={{cursor:'pointer', 
    //         width:'16px', 
    //         height: '16px', 
    //         margin:'4px',
    //         backgroundImage, 
    //         backgroundPosition: -(spriteIndex % sheetWidth)*16+'px '+-(Math.floor(spriteIndex/sheetWidth))*16+'px', 
    //         backgroundRepeat:'no-repeat',
    //         transform:'scale(2)',
    //         display:'inline-block'}}/>
    // )
} 
        
