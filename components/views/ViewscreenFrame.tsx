import * as React from 'react'
import { Modal, Rounds, Avatars } from '../../enum';
import Menu from './modals/Menu';
import { connect } from 'react-redux';
import Lobby from './modals/Lobby';
import { Button } from '../Shared';
import { onShowModal, onBuzzIn } from '../uiManager/Thunks';
import MatchLobby from './modals/MatchLobby';
import Provider from '../../firebase/Network';

interface Props {
    modalState?:Modal
    modalData?:any
    match?:Match
    players?:Array<PlayerState>
    me?:PlayerState
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    modalData: state.modalData,
    match: state.match,
    me: state.onlineAccount,
    players: state.players
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        switch(this.props.modalState){
            case Modal.MENU: return <Menu/>
            case Modal.LOBBY: return <Lobby/>
            case Modal.MATCHES: return <MatchLobby/>
        }
    }

    render(){
            const isStarted = this.props.match && this.props.match.isStarted
            const player = this.props.players && this.props.players.find(p=>p.uid === this.props.me.uid)
            return (
                <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%'}}>
                    
                    {/* {Button(true, ()=>Provider.uploadQuestions(), 'Uplord')} */}
                </div>
            )
    }
}