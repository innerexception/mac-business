import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, NumericInput, TopBar } from '../Shared';
import { connect } from 'react-redux';
import Bracket from './Bracket';
import Provider from '../../firebase/Network';

interface Props {
    me?: PlayerStats
    match?:Tournament
    round:number
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class BracketView extends React.PureComponent<Props> {

    render(){
        const brackets = this.props.match.brackets.filter(b=>b.round === this.props.round)
        if(!this.props.me) return <span/>
        const isParticipant = this.props.me?.tournamentId === this.props.match.id
        return (
            <div>
                {brackets.map(b=>
                <div style={{padding:'5px', border:'1px '+(this.props.round === this.props.match.activeRound ? 'dashed':'solid'), marginBottom:'1em'}}>
                    <Bracket 
                        isParticipant={isParticipant}
                        bracketId={b.uid+b.player1Id}
                        playerId={b.player1Id} 
                        wager={this.props.me.wagers?.find(w=>w.bracketId === b.uid && w.playerToWin === b.player1Id)}
                        myId={this.props.me.uid}/>
                    <h5 style={{textAlign:'center', margin:'0.5em'}}>VS</h5>
                    <Bracket 
                        isParticipant={isParticipant}
                        bracketId={b.uid+b.player2Id}
                        playerId={b.player2Id} 
                        wager={this.props.me.wagers?.find(w=>w.bracketId === b.uid && w.playerToWin === b.player2Id)}
                        myId={this.props.me.uid}/>
                </div>
                )}
            </div>
        )
    }
}