import { UIReducerActions, Modal } from '../../enum'
import { dispatch, store } from '../../App'
import Provider from '../../firebase/Network'

export const onLeaveMatch = () => {
    let state = store.getState()
    Provider.unsubscribeTourney(state.onlineAccount.uid)
    dispatch({
        type: UIReducerActions.LEAVE_MATCH
    })
}

export const onHideModal = () => {
    dispatch({
        type: UIReducerActions.HIDE_MODAL
    })
}

export const onLoginUser = (user:PlayerStats) => {
    dispatch({
        type: UIReducerActions.LOGIN_SUCCESS,
        user
    })
}

export const onJoinExisting = (user:PlayerStats, match:Tournament) => {
    dispatch({
        type: UIReducerActions.JOIN_EXISTING,
        user, match
    })
}

export const onLogoutUser = () => {
    dispatch({
        type: UIReducerActions.LOGOUT
    })
}

export const onShowModal = (modal:Modal, data?:any) => {
    dispatch({
        type: UIReducerActions.SHOW_MODAL,
        modal,
        data
    })
}

export const onJoinMatch = async (matchId:string, player:PlayerStats) => {
    await Provider.joinMatch(matchId, player)
}

export const onTournamentUpdated = (match:Tournament) => {
    dispatch({
        type: UIReducerActions.MATCH_UPDATED,
        match
    })
}

export const onUpdatePlayer = (player:PlayerStats) => {
    Provider.onUpdatePlayer(player)
    dispatch({
        type: UIReducerActions.UPDATE_PLAYER,
        player
    })
}