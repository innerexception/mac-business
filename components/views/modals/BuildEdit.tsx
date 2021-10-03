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
            <div>
                <div>
                    {build.map((b,i)=>
                        <Tooltip overlay={<AbilityTooltip ability={b}/>} placement="bottom">
                            <div style={{display:'flex'}}>
                                <h5>{i+1}</h5>
                                <h5>{b.name}</h5>
                                {Button(i > 0, ()=>this.onMoveUp(i), 'up')}
                                {Button(i < this.state.build.length-1, ()=>this.onMoveDown(i), 'down')}
                                {Button(true, ()=>this.onRemove(i), 'x')}
                            </div>
                        </Tooltip>
                    )}
                </div>
                <div>
                    {abils.map(a=>
                        <div>
                            <h5>{a.name}</h5>
                            <h6>{a.description}</h6>
                            {Button(true, ()=>this.addNew(a), '+')}
                        </div>
                    )}
                </div>
                {Button(true, ()=>{Provider.onSubmitBuild({...this.props.me, build: this.state.build});onHideModal()}, 'Lock In')}
            </div>
        )
    }
}