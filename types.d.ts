interface Tournament {
    id:string
    activeRound: number
    brackets: Array<Bracket>
    hasStarted:boolean
    hasEnded:boolean
    lastCheck:number
    isVoting:boolean
}

interface EdictData {
    name:import('./enum').Edict
    description:string
}

interface Bracket {
    uid:string
    round: number
    odds: number
    player1?: string
    player2?: string
}

interface AbilityData {
    type: import('./enum').Ability
    name: string
    description:string
    corp: import('./enum').Corporation
    moraleCost: number
    moraleDmg: number
    moraleGain: number
    soulCost: number
    soulDmg: number
    soulGain: number
    capitalCost: number
    capitalDmg: number
    capitalGain: number
}

interface BuildHistory {
    abilities: Array<AbilityData>
}

interface PlayerStats {
    uid:string
    name:string
    avatarIndex:number
    employer: import('./enum').Corporation
    currentWins: Array<BuildHistory>
    build: Array<AbilityData>
    wagers: Array<Wager>
    votes: number
    pendingVote: import('./enum').Edict
    tournamentId: string
    capital:number
    morale:number
    soul:number
    followers: number
    wins:number
}

interface PlayerVoteParams {
    playerId:string
    edict: import('./enum').Edict
}

interface Wager {
    bracketId: string
    amount: number
    playerToWin: string
}

interface CorpoData {
    name:string
    color: string
    description:string
    soul:number
    morale:number
    capital:number
}

interface ModalState { modal: import('./enum').Modal, data?: any }

interface RState {
    modalState: ModalState
    tournament: Tournament
    onlineAccount: PlayerStats
}