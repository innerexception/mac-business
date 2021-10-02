import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, TopBar } from '../Shared';
import { onJoinMatch, onHideModal, onUpdatePlayer, onShowModal } from '../uiManager/Thunks';
import { connect } from 'react-redux';
import Dialog from './Dialog';
import { Avatars, Modal } from '../../enum';
import Tooltip from 'rc-tooltip'
import PlayerHistory from './PlayerHistory';
import Bracket from './Bracket';

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
        return (
            <div>
                {brackets.map(b=>
                <div>
                    <Bracket playerId={b.player1} myId={this.props.me.uid}/>
                    <Bracket playerId={b.player2} myId={this.props.me.uid}/>
                </div>
                )}
            </div>
        )
    }
}