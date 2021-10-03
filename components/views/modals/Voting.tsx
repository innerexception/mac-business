import * as React from 'react'
import { Button, TopBar } from '../../Shared';
import Provider from '../../../firebase/Network';
import { Corporations, Edict, EdictArray, Edicts } from '../../../enum';
import { connect } from 'react-redux';
import AppStyles from '../../../AppStyles';

interface Props {
    me?:PlayerStats
    match?:Tournament
}

interface State {
    player: PlayerStats
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class Voting extends React.PureComponent<Props, State> {

    state:State = { player: null }

    componentDidMount = async () => {
        const winner = this.props.match?.brackets.filter(b=>b.round === this.props.match.activeRound).find(b=>b.player1Id || b.player2Id)
        if(winner){
            let player = await Provider.fetchPlayer(winner.player1Id || winner.player2Id)
            this.setState({player})
        }
    }

    render(){
        return (
            <div style={{...AppStyles.modal, ...AppStyles.centered, width:'400px'}}>
                {this.state.player && 
                <div style={{textAlign:'center', marginBottom:'1em'}}>
                    <h3>Congratulations {Corporations[this.state.player.employer].name}!!!</h3>
                    <div>
                        <h6 style={{whiteSpace:'pre-wrap', fontSize:'6px'}}>{Corporations[this.state.player.employer].logo}</h6>
                    </div>
                    <h5>Represented by</h5>
                    <h6>{this.state.player.name}</h6>
                </div>}
                
                <h3 style={{marginBottom:'1em'}}>Your Vote Matters!</h3>
                <h5 style={{marginBottom:'1em'}}>Tell us how we can improve.</h5>
                <h5 style={{marginBottom:'1em'}}>Your votes: {this.props.me.votes}</h5>
                <h5 style={{marginBottom:'1em'}}>Gambling guarantees citizenship!* Earn votes by betting. <h6>*citizenship not guranteed and depends on geographic place of birth. other restrictions apply.</h6></h5>
                {this.props.me.pendingVote ? <h5>You voted for {Edicts[this.props.me.pendingVote].name}.</h5> :
                    EdictArray.map(e=>
                        <div style={{marginBottom:'1em'}}>
                            <h5>{Edicts[e].name}</h5>
                            <h6 style={{marginBottom:'0.5em'}}>{Edicts[e].description}</h6>
                            {Button(!this.props.me.pendingVote && this.props.me.votes > 0, ()=>Provider.onSubmitVotes({edict:e, playerId:this.props.me.uid}), this.props.me.votes > 0 ? 'Vote Up ->' : 'No votes!')}
                        </div>
                )}
            </div>
        )
    }
}