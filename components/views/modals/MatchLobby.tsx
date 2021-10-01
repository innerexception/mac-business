import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button, TopBar } from '../../Shared';
import { onHideModal, onLeaveMatch } from '../../uiManager/Thunks';
import { connect } from 'react-redux';
import { Avatar } from './Lobby';

interface Props {
    match?:Tournament
    me?:PlayerStats
}

interface State { 
    playerName:string
    isLoading:boolean
}

@(connect((state: RState) => ({
    match: state.tournament,
    me: state.onlineAccount
})) as any)
export default class MatchLobby extends React.PureComponent<Props,State> {
    state = { 
        playerName:'',
        isLoading:false
    }

    componentDidMount(){
        // this.state.lobby = new Audio(lobbyMusic)
        // this.state.lobby.loop = true
        // this.state.lobby.play()
    }

    componentWillUnmount(){
        //this.state.lobby.pause()
    }

    render(){
        return (
            <div style={{...AppStyles.window}}>
                {TopBar('MacBusiness')}
                {/* <div style={{padding:'0.5em'}}>
                    <h3>Joining conference at</h3>
                    <h3>{this.props.activeSession.sessionName} Corp</h3>
                    <div style={{marginBottom:'1em', alignItems:'center', overflow:'auto', maxHeight:'66vh'}}>
                        {this.props.activeSession.players.map((player) => 
                            <div style={styles.nameTag}>
                                {player.name}
                            </div>
                        )}
                    </div>
                    <div>{this.getErrors()}</div>
                    {this.getErrors() ? '' : 
                        <div style={AppStyles.buttonOuter} 
                            onClick={this.startMatch}>
                            <div style={{border:'1px solid', borderRadius: '3px', opacity: this.getErrors() ? 0.5 : 1}}>Start</div>
                        </div>}
                </div> */}
            </div>
        )
    }
}

const styles = {

}