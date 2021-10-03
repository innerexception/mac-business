import * as React from 'react'
import { Button, TopBar } from '../../Shared';
import Provider from '../../../firebase/Network';
import { Edict, Edicts } from '../../../enum';
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
                <h4>Your votes: {this.props.me.votes}</h4>
                {Object.keys(Edict).map((e:Edict)=>
                    <div style={{width:'100px'}}>
                        <h5>{Edicts[e].name}</h5>
                        <h6>{Edicts[e].description}</h6>
                        {Button(!this.props.me.pendingVote, ()=>Provider.onSubmitVotes({edict:e, playerId:this.props.me.uid}), 'Make it so ->')}
                    </div>
                )}
            </div>
        )
    }
}