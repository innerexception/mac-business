import * as React from 'react'
import { Modal } from '../../enum';
import Menu from './modals/Menu';
import { connect } from 'react-redux';
import Lobby from './modals/Lobby';
import { Button } from '../Shared';
import { onShowModal } from '../uiManager/Thunks';
import MatchLobby from './modals/MatchLobby';
import Provider from '../../firebase/Network';

interface Props {
    modalState?: ModalState,
    modalData?: Tournament,
    me?: PlayerStats,
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    modalData: state.tournament,
    me: state.onlineAccount,
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        switch(this.props.modalState.modal){
            case Modal.MENU: return <Menu/>
            case Modal.LOBBY: return <Lobby/>
            case Modal.MATCHES: return <MatchLobby/>
        }
    }

    render(){
            return (
                <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%'}}>
                    
                    {/* {Button(true, ()=>Provider.uploadQuestions(), 'Uplord')} */}
                </div>
            )
    }
}