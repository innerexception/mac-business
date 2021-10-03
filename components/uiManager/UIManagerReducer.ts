import { UIReducerActions, Modal } from '../../enum'
import Provider from '../../firebase/Network';

const appReducer = (state = getInitialState(), action:any):RState => {
    switch (action.type) {
        case UIReducerActions.LOGIN_FAILED:
            return { ...state, modalState: { modal: Modal.MENU }}
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modalState: {modal: action.modal, data: action.data }}
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modalState: null }
        case UIReducerActions.LOGIN_SUCCESS:
            return { ...state, onlineAccount: action.user, modalState: null}
        case UIReducerActions.MATCH_UPDATED:
            return { ...state, tournament: action.match }
        case UIReducerActions.LEAVE_MATCH:
            return { ...state, modalState: {modal: Modal.MENU }}
        case UIReducerActions.LOGOUT:
            if(state.onlineAccount) Provider.unsubscribeTourney(state.onlineAccount.uid)
            return getInitialState()
        case UIReducerActions.UPDATE_PLAYER:
            return { ...state, onlineAccount: action.player}
        case UIReducerActions.JOIN_EXISTING:
            return { ...state, onlineAccount: action.user, modalState: null, tournament: action.match }
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modalState: { modal: Modal.MENU },
        onlineAccount: null,
        tournament: null
    }
}
