import * as React from 'react'
import { Corporations, Modal } from '../../enum';
import Menu from './modals/Menu';
import { connect } from 'react-redux';
import { Button } from '../Shared';
import { onTournamentUpdated, onShowModal } from '../uiManager/Thunks';
import BracketView from './BracketView';
import BuildEdit from './modals/BuildEdit';
import ChooseEmployer from './modals/ChooseEmployer';
import Voting from './modals/Voting';

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
            case Modal.EDIT_BUILD: return <BuildEdit/>
            case Modal.CHOOSE_EMPLOYMENT: return <ChooseEmployer/>
        }
    }

    render(){
            const tourney = this.props.tournament
            return (
                <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%', overflow:'auto'}}>
                    {this.props.modalState && this.getModal()}
                    {tourney ? 
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'1em', width:'100%'}}>
                        {this.props.me?.employer != undefined ? <div style={{marginBottom:'1em'}}>{this.props.me.name} Personal Portal c2034 {Corporations[this.props.me.employer].name}</div> : <div style={{marginBottom:'1em'}}>Employee Personal Portal (Spectator)</div>}
                        {tourney.hasStarted && !tourney.isVoting ?
                            <div>Next round locks in {3-new Date(Date.now()-tourney.lastCheck).getMinutes()} min</div> :
                            <div>Next Tournament in {3-new Date(Date.now()-tourney.lastCheck).getMinutes()} min</div>
                        }
                        {tourney.isVoting && <Voting/>}
                        {!this.props.me?.tournamentId && !tourney.hasStarted && Button(true, ()=>onShowModal(Modal.CHOOSE_EMPLOYMENT), 'Join Tournament')}
                        <div style={{display:'flex', marginTop:'1em', width:'100%'}}>
                            {new Array(tourney.activeRound).fill({}).map((b,i)=>
                            <div style={{width:'200px', textAlign:'center'}}>Round {i+1}</div>
                            )}
                        </div>
                        <div style={{overflow:'auto', maxHeight:'75vh', width:'100%'}}>
                            {new Array(tourney.activeRound).fill({}).map((b,i)=>
                            <div style={{width:'200px'}}><BracketView key={Math.random()} round={i+1}/></div>
                            )}
                        </div>
                        {tourney.hasStarted && 
                        <div style={{width:'100%'}}>
                            <h4 style={{marginBottom:'1em'}}>Messages</h4>
                            {tourney.brackets.map(b=>b.messages).map(bracket=>
                                <div>
                                    {bracket.map(text=>
                                        <div>{text.text}</div>    
                                    )}
                                </div>
                            )}
                        </div>}
                    </div> : <div>Connecting...</div>}
                </div> 
            )
    }
}