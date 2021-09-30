import { UIReducerActions, Modal } from '../../enum'
import Provider from '../../firebase/Network';

const appReducer = (state = getInitialState(), action:any):RState => {
    switch (action.type) {
        case UIReducerActions.LOGIN_FAILED:
            return { ...state, modalState: Modal.MENU }
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modalState: action.modal, modalData: action.data }
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modalState: null }
        case UIReducerActions.LOGIN_SUCCESS:
            return { ...state, onlineAccount: action.user, modalState: Modal.LOBBY }
        case UIReducerActions.MATCH_UPDATED:
            if(state.match.activePlayerId && action.match.activePlayerId){
                action.match.activePlayerId = state.match.activePlayerId
            }
            return { ...state, match: action.match }
        case UIReducerActions.MATCH_HOSTED:
        return { ...state, match: action.match, modalState: Modal.MATCHES}
        case UIReducerActions.MATCH_JOIN:
            return { ...state, match:action.match, modalState: Modal.MATCHES }
        case UIReducerActions.LEAVE_MATCH:
            return { ...state, match: null, modalState: Modal.LOBBY }
        case UIReducerActions.LOGOUT:
            if(state.onlineAccount) Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
            return getInitialState()
        case UIReducerActions.UPDATE_PLAYER:
            return { ...state, onlineAccount: action.player}
        case UIReducerActions.PLAYERS_UPDATED:
            return { ...state, players: action.players }
        case UIReducerActions.JOIN_EXISTING:
            return { ...state, onlineAccount: action.user, match: action.match, modalState: action.match.isStarted ? null : Modal.MATCHES }
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modalState: Modal.MENU,
        modalData: null,
        match: null,
        players: null,
        onlineAccount: null
    }
}
