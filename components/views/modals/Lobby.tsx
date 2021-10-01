import * as React from 'react'
import AppStyles, { colors } from '../../../AppStyles';
import { Button, TopBar } from '../../Shared';
import { onJoinMatch, onHideModal, onUpdatePlayer } from '../../uiManager/Thunks';
import { connect } from 'react-redux';
import Dialog from '../Dialog';
import { Avatars } from '../../../enum';

interface Props {
    me?: PlayerStats
    match?:Tournament
}

interface State { 
    playerName:string
    matchCode: string
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class Lobby extends React.PureComponent<Props,State> {
    state:State = { 
        playerName: this.props.me.name, 
        matchCode: '',
    }

    render(){
        return (
            <div>
                <div style={{...AppStyles.window}}>
                    {TopBar('MacBusiness')}
                    <div style={{padding:'0.5em'}}>
                        <h3 style={{margin:'0'}}>Name</h3>
                        {/* <input style={{...styles.loginInput, marginBottom:'0.5em'}} type="text" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                        <h3 style={{margin:'0'}}>Buisness Name</h3>
                        <input style={{...styles.loginInput, marginBottom:'1em'}} type="text" value={this.state.sessionId} onChange={(e)=>this.setState({sessionId:e.currentTarget.value})}/>
                        {Button(this.state.name && this.state.sessionId, ()=>onLogin(getUser(this.state.name), this.state.sessionId), 'Ok')} */}
                    </div>
                </div>
            </div>
        )
    }
}

export const Avatar = (avatarIndex:number) => <span style={{fontFamily:'avatar', paddingLeft:'5px', paddingTop:'4px', color:'orange'}}>{Avatars[avatarIndex]}</span>