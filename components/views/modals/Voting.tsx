import * as React from 'react'
import { Button, TopBar } from '../../Shared';
import Provider from '../../../firebase/Network';
import { Edict, EdictArray, Edicts } from '../../../enum';
import { connect } from 'react-redux';
import AppStyles from '../../../AppStyles';

interface Props {
    me?:PlayerStats
}

@(connect((state: RState) => ({
    me: state.onlineAccount
})) as any)
export default class Voting extends React.PureComponent<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, ...AppStyles.centered}}>
                <h4 style={{marginBottom:'1em'}}>Your Vote Matters!</h4>
                <h5 style={{marginBottom:'1em'}}>Tell us how we can improve.</h5>
                <h5 style={{marginBottom:'1em'}}>Your votes: {this.props.me.votes}</h5>
                {this.props.me.pendingVote ? <h5>You voted for {Edicts[this.props.me.pendingVote].name}.</h5> :
                    EdictArray.map(e=>
                        <div style={{marginBottom:'1em'}}>
                            <h5>{Edicts[e].name}</h5>
                            <h6 style={{marginBottom:'0.5em'}}>{Edicts[e].description}</h6>
                            {Button(!this.props.me.pendingVote, ()=>Provider.onSubmitVotes({edict:e, playerId:this.props.me.uid}), 'Vote Up ->')}
                        </div>
                )}
            </div>
        )
    }
}