import * as React from 'react'
import { Modal } from '../../enum';
import Menu from './modals/Menu';
import { connect } from 'react-redux';
import Lobby from './modals/Lobby';
import { Button } from '../Shared';
import { onTournamentUpdated, onShowModal } from '../uiManager/Thunks';
import Provider from '../../firebase/Network';
import BracketView from './BracketView';
import BuildEdit from './modals/BuildEdit';
import ChooseEmployer from './modals/ChooseEmployer';

interface Props {
    modalState?: ModalState,
    tournament?: Tournament,
    me?: PlayerStats,
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    tournament: state.tournament,
    me: state.onlineAccount,
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        switch(this.props.modalState.modal){
            case Modal.MENU: return <Menu/>
            case Modal.LOBBY: return <Lobby/>
            case Modal.EDIT_BUILD: return <BuildEdit/>
            case Modal.CHOOSE_EMPLOYMENT: return <ChooseEmployer/>
        }
    }

    render(){
            const tourney = this.props.tournament
            return (
                tourney ? 
                <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%', overflowX:'auto'}}>
                    {this.props.modalState && <div style={{position:'absolute', top:0, left:0}}>{this.getModal()}</div>}
                    {!this.props.me.tournamentId && !this.props.tournament.hasStarted && Button(true, ()=>onShowModal(Modal.CHOOSE_EMPLOYMENT), 'Join Tournament')}
                    <div style={{display:'flex'}}>
                        {new Array(tourney.finalBracket).fill({}).map((b,i)=>
                        <div style={{width:'100px', textAlign:'center'}}>Round {i}</div>
                        )}
                    </div>
                    <div style={{overflow:'auto', height:'55vh'}}>
                        {new Array(tourney.finalBracket).fill({}).map((b,i)=>
                        <div style={{width:'100px'}}><BracketView round={i}/></div>
                        )}
                    </div>
                </div> : 
                <div>Loading...</div>
            )
    }
}