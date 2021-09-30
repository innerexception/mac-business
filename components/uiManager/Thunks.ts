import { UIReducerActions, Modal, Rounds } from '../../enum'
import { dispatch, store } from '../../App';
import Provider from '../../firebase/Network';
import { getNextPlayerId } from '../Util';

export const onLeaveMatch = () => {
    let state = store.getState()
    Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
    if(state.match.hostId === state.onlineAccount.uid) Provider.deleteMatch(state.match.id) 
    dispatch({
        type: UIReducerActions.LEAVE_MATCH
    })
}

export const onRemovePlayer = (playerId:string) => {
    let state = store.getState()
    Provider.deletePlayer(state.match, playerId)
}

export const onHideModal = () => {
    dispatch({
        type: UIReducerActions.HIDE_MODAL
    })
}

export const onUpdateQuestionValue = (value:number) => {
    let match = store.getState().match
    match.activeQuestion.value = ''+value
    Provider.upsertMatch(match)
}

export const onChooseActiveQuestion = (question:Question) => {
    const match = question.bonus ? {...store.getState().match, activeQuestion: question } : {...store.getState().match, activeQuestion: question, activePlayerId:null }
    Provider.upsertMatch(match)
    onShowModal(Modal.QUESTION, match)
}

export const onMatchHosted = (match:Match) => {
    dispatch({
        type: UIReducerActions.MATCH_HOSTED,
        match
    })
}

export const onLoginUser = (user:PlayerState) => {
    dispatch({
        type: UIReducerActions.LOGIN_SUCCESS,
        user
    })
}

export const onJoinExisting = (user:PlayerState, match:Match) => {
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

export const onCreateMatch = async (hostId:string) => {
    return await Provider.createMatch(hostId)
}

export const onJoinMatch = async (matchId:string, player:PlayerState) => {
    await Provider.joinMatch(matchId, player)
}

export const onStartMatch = async (match:Match, players:Array<PlayerState>) => {
    Provider.upsertMatch({...match, isStarted: true, activePlayerId: players[0].uid })
    onHideModal()
}

export const onBuzzIn = () => {
    let match = store.getState().match
    const me = store.getState().players.find(p=>p.uid === store.getState().onlineAccount.uid)
    if(!store.getState().players.find(p=>p.isBuzzed)) {
        Provider.upsertMatch({...match, activePlayerId: me.uid})
        Provider.upsertPlayer(match, {...me, isBuzzed: true})
    }
}

export const onPlayersUpdated = (players:Array<PlayerState>) => {
    dispatch({
        type: UIReducerActions.PLAYERS_UPDATED,
        players
    })
}

export const onMatchUpdated = (match:Match) => {
    dispatch({
        type: UIReducerActions.MATCH_UPDATED,
        match
    })
}

export const onMatchJoin = (match:Match) => {
    dispatch({
        type: UIReducerActions.MATCH_JOIN,
        match
    })
}

export const onUpdatePlayer = (player:PlayerState) => {
    Provider.onUpdatePlayer(player)
    dispatch({
        type: UIReducerActions.UPDATE_PLAYER,
        player
    })
}

export const onClearAnswer = async (correct:boolean, pass?:boolean) => {
    let match = store.getState().match
    let players = store.getState().players
    for(let p of players){
        p.isBuzzed = false
        if(p.uid === match.activePlayerId){
            if(correct){
                p.currentWinnings += +match.activeQuestion.value
                p.totalWinnings += +match.activeQuestion.value
            }
            else if(!pass){
                p.currentWinnings -= +match.activeQuestion.value
                p.totalWinnings -= +match.activeQuestion.value
            }
        }
    }
    await Provider.upsertPlayers(match, players)
    match.roundCategories[match.round].questions = match.roundCategories[match.round].questions.filter(q=>q.id !== match.activeQuestion.id)
    if(match.roundCategories[match.round].questions.length === 0){
        match.round++
        if(match.round < Rounds.MostExtremeDanger){
            onShowModal(Modal.NEW_ROUND)
        }
        else {
            return onShowModal(Modal.SCORES)
        }
    }
    else onHideModal()
    match.activeQuestion = null
    if(!correct) match.activePlayerId = getNextPlayerId(store.getState().players, match.activePlayerId)
    Provider.upsertMatch({...match})
}

