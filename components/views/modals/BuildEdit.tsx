import * as React from 'react'
import AppStyles, { colors } from '../../../AppStyles';
import { Button, TopBar } from '../../Shared';
import { onJoinMatch, onHideModal, onUpdatePlayer, onShowModal } from '../../uiManager/Thunks';
import { connect } from 'react-redux';
import Dialog from '../Dialog';
import { Avatars, Modal } from '../../../enum';
import Tooltip from 'rc-tooltip'
import PlayerHistory, { AbilityTooltip } from '../PlayerHistory';
import Provider from '../../../firebase/Network';

interface Props {
    me?: PlayerStats
    match?:Tournament
}

interface State {
    build:Array<Ability>
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class BuildEdit extends React.PureComponent<Props, State> {

    state:State = {
        build: []
    }

    onMoveUp = (index:number) => {
        const item = this.state.build[index]
        this.state.build[index] = this.state.build[index-1]
        this.state.build[index-1] = item
        this.setState({build: this.state.build})
    }
    onMoveDown = (index:number) => {
        const item = this.state.build[index]
        this.state.build[index] = this.state.build[index+1]
        this.state.build[index+1] = item
        this.setState({build: this.state.build})
    }
    onRemove = (index:number) => {
        this.state.build.splice(index, 1)
        this.setState({build: this.state.build})
    }

    render(){
        const build = this.props.me.build
        return (
            <div>
                {build.map((b,i)=>
                    <Tooltip overlay={<AbilityTooltip ability={b}/>} placement="bottom">
                        <div style={{display:'flex'}}>
                            <h5>{i+1}</h5>
                            <h5>{b.name}</h5>
                            {Button(i > 0, ()=>this.onMoveUp(i), 'up')}
                            {Button(i < this.props.me.build.length, ()=>this.onMoveDown(i), 'down')}
                            {Button(true, ()=>this.onRemove(i), 'x')}
                        </div>
                    </Tooltip>
                )}
                {Button(true, ()=>Provider.onSubmitBuild({...this.props.me, build: this.state.build}), 'Lock In')}
            </div>
        )
    }
}