import * as React from 'react'
import AppStyles, { colors } from '../../../AppStyles';
import { Button, TopBar } from '../../Shared';
import { connect } from 'react-redux';
import Dialog from '../Dialog';
import { Ability, Modal } from '../../../enum';
import Tooltip from 'rc-tooltip'
import PlayerHistory, { AbilityTooltip } from '../PlayerHistory';
import Provider from '../../../firebase/Network';
import { Abilities } from '../../../functions/src/Abilities';
import { onHideModal } from '../../uiManager/Thunks';

interface Props {
    me?: PlayerStats
    match?:Tournament
}

interface State {
    build:Array<AbilityData>
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class BuildEdit extends React.PureComponent<Props, State> {

    state:State = {
        build: this.props.me.build
    }

    onMoveUp = (index:number) => {
        const item = this.state.build[index]
        this.state.build[index] = this.state.build[index-1]
        this.state.build[index-1] = item
        this.setState({build: Array.from(this.state.build)})
    }
    onMoveDown = (index:number) => {
        const item = this.state.build[index]
        this.state.build[index] = this.state.build[index+1]
        this.state.build[index+1] = item
        this.setState({build: Array.from(this.state.build)})
    }
    onRemove = (index:number) => {
        this.state.build.splice(index, 1)
        this.setState({build: Array.from(this.state.build)})
    }
    addNew = (abil:AbilityData) => {
        this.state.build.push(abil)
        this.setState({build: Array.from(this.state.build)})
    }

    render(){
        const build = this.state.build
        const abils = Object.keys(Abilities).filter((a:Ability)=>Abilities[a].corp === this.props.me.employer).map((a:Ability)=>Abilities[a])
        return (
            <div style={{...AppStyles.modal, ...AppStyles.centered}}>
                <div style={{display:'flex'}}>
                    <div style={{width:'300px', marginRight:'1em'}}>
                        <h5 style={{marginBottom:'0.5em'}}>Employer Perks</h5>
                        {abils.map(a=>
                            <div style={{display:'flex', alignItems:'center', marginBottom:'0.5em'}}>
                                {Button(this.state.build.length < 3, ()=>this.addNew(a), '+')}
                                <Tooltip overlay={<AbilityTooltip ability={a}/>} placement='bottom'>
                                    <h5 style={{marginLeft:'0.5em'}}>{a.name}</h5>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                    <div style={{width:'300px'}}>
                        <h5 style={{marginBottom:'0.5em'}}>Your Action Plan (max 3)</h5>
                        {build.map((b,i)=>
                            <Tooltip overlay={<AbilityTooltip ability={b}/>} placement="bottom">
                                <div>
                                    <div style={{display:'flex'}}>
                                        <h5 style={{marginRight:'0.5em'}}>{i+1}</h5>
                                        <h5>{b.name}</h5>
                                    </div>
                                    <div style={{display:'flex'}}>
                                        {Button(i > 0, ()=>this.onMoveUp(i), '+')}
                                        {Button(i < this.state.build.length-1, ()=>this.onMoveDown(i), '-')}
                                        {Button(true, ()=>this.onRemove(i), 'x')}
                                    </div>
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </div>
                {Button(true, ()=>{Provider.onSubmitBuild({...this.props.me, build: this.state.build});onHideModal()}, 'Lock In')}
            </div>
        )
    }
}