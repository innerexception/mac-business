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

interface State {
    wager:number
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class BracketView extends React.PureComponent<Props, State> {

    state:State = { wager: 0 }

    render(){
        const brackets = this.props.match.brackets.filter(b=>b.round === this.props.round)
        const isParticipant = this.props.me.tournamentId === this.props.match.id
        return (
            <div>
                {brackets.map(b=>
                <div>
                    <Bracket playerId={b.player1Id} myId={this.props.me.uid}/>
                    {!isParticipant && 
                    <div>
                        <h5>Wager</h5>
                        {NumericInput(this.state.wager, (val)=>this.setState({wager: val}), this.props.me.votes, 0)}
                        {Button(true, ()=>Provider.onSubmitWager({ amount: this.state.wager, bracketId: b.uid, playerToWin: b.player1Id}), 'Wager')}
                    </div>
                    }
                    <Bracket playerId={b.player2Id} myId={this.props.me.uid}/>
                    {!isParticipant && 
                    <div>
                        <h5>Wager</h5>
                        {NumericInput(this.state.wager, (val)=>this.setState({wager: val}), this.props.me.votes, 0)}
                        {Button(true, ()=>Provider.onSubmitWager({ amount: this.state.wager, bracketId: b.uid, playerToWin: b.player2Id}), 'Wager')}
                    </div>
                    }
                </div>
                )}
            </div>
        )
    }
}