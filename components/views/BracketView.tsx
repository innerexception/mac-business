import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, TopBar } from '../Shared';
import { onJoinMatch, onHideModal, onUpdatePlayer, onShowModal } from '../uiManager/Thunks';
import { connect } from 'react-redux';
import Dialog from './Dialog';
import { Avatars, Modal } from '../../enum';
import Tooltip from 'rc-tooltip'
import PlayerHistory from './PlayerHistory';

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
                    <Tooltip overlay={<PlayerHistory history={b.player1.wins}/>} placement="bottom">
                        <div style={{display:'flex'}}>
                            {Avatar(b.player1.avatarIndex)}
                            <h5>{b.player1.name}</h5>
                            {b.player1.uid === this.props.me.uid && Button(true, ()=>onShowModal(Modal.EDIT_BUILD), 'Edit')}
                        </div>
                    </Tooltip>
                    <Tooltip overlay={<PlayerHistory history={b.player2.wins}/>} placement="bottom">
                        <div style={{display:'flex'}}>
                            {Avatar(b.player2.avatarIndex)}
                            <h5>{b.player2.name}</h5>
                            {b.player2.uid === this.props.me.uid && Button(true, ()=>onShowModal(Modal.EDIT_BUILD), 'Edit')}
                        </div>
                    </Tooltip>
                </div>
                )}
            </div>
        )
    }
}

export const Avatar = (avatarIndex:number) => <span style={{fontFamily:'avatar', paddingLeft:'5px', paddingTop:'4px', color:'orange'}}>{Avatars[avatarIndex]}</span>