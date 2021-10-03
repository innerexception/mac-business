import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, TopBar } from '../Shared';
import { onJoinMatch, onHideModal, onUpdatePlayer, onShowModal } from '../uiManager/Thunks';
import Dialog from './Dialog';
import { Avatars, Modal } from '../../enum';
import Tooltip from 'rc-tooltip'
import PlayerHistory from './PlayerHistory';
import Provider from '../../firebase/Network';

interface Props {
    playerId:string
    myId:string
}

interface State {
    player: PlayerStats
}

export default class Bracket extends React.PureComponent<Props, State> {

    state:State = {
        player: null
    }

    componentDidMount = async () => {
        let player = await Provider.fetchPlayer(this.props.playerId)
        this.setState({player})
    }

    render(){
        return (
            this.state.player ? 
            <Tooltip overlay={<PlayerHistory history={this.state.player.currentWins}/>} placement="bottom">
                <div style={{display:'flex'}}>
                    {Avatar(this.state.player.avatarIndex)}
                    <h5>{this.state.player.name}</h5>
                    {this.state.player.uid === this.props.myId && Button(true, ()=>onShowModal(Modal.EDIT_BUILD), 'Edit')}
                </div>
            </Tooltip> : 
            <h5>{"<empty>"}</h5>
        )
    }
}

export const Avatar = (avatarIndex:number) => <span style={{fontFamily:'avatar', paddingLeft:'5px', paddingTop:'4px', color:'orange'}}>{Avatars[avatarIndex]}</span>