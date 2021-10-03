import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, NumericInput, TopBar } from '../Shared';
import { onJoinMatch, onHideModal, onUpdatePlayer, onShowModal } from '../uiManager/Thunks';
import Dialog from './Dialog';
import { Avatars, Corporations, Modal } from '../../enum';
import Tooltip from 'rc-tooltip'
import PlayerHistory from './PlayerHistory';
import Provider from '../../firebase/Network';

interface Props {
    playerId:string
    myId:string
    bracketId:string
    isParticipant:boolean
    wager: Wager
}

interface State {
    player: PlayerStats
    wager: number
}

export default class Bracket extends React.PureComponent<Props, State> {

    state:State = {
        player: null,
        wager: this.props.wager? this.props.wager.amount : 0
    }

    componentDidMount = async () => {
        let player = await Provider.fetchPlayer(this.props.playerId)
        this.setState({player})
    }

    render(){
        return (
            this.state.player ? 
            <Tooltip overlay={<PlayerHistory history={this.state.player.currentWins}/>} placement="bottom">
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{position:'relative', width:'100%', height:'50px'}}>
                        <h6 style={{position:'absolute', top:0, left:Corporations[this.state.player.employer].left, whiteSpace:'pre-wrap', fontSize:'6px', width:Corporations[this.state.player.employer].width || '300px', transform:'scale(0.5)'}}>{Corporations[this.state.player.employer].logo}</h6>
                    </div>
                    <h5 style={{textAlign:'center', marginBottom:'0.5em', marginTop:'0.5em'}}>{this.state.player.name}</h5>
                    {this.state.player.uid === this.props.myId && Button(true, ()=>onShowModal(Modal.EDIT_BUILD), 'Edit')}
                    {!this.props.isParticipant &&
                    <div>
                        {NumericInput(this.state.wager, (val)=>this.setState({wager: val}), this.state.player.votes, 0)}
                        {Button(true, ()=>Provider.onSubmitWager({ amount: this.state.wager, bracketId: this.props.bracketId, playerToWin: this.state.player.uid}), 'Place Bet')}
                    </div>
                    }
                </div>
            </Tooltip> : 
            <h5 style={{textAlign:'center'}}>{"<empty>"}</h5>
        )
    }
}