interface Tournament {
    id:string
    activeRound: number
    finalRound: number
    brackets: Array<Bracket>
    hasStarted:boolean
    hasEnded:boolean
    lastCheck:number
    isVoting:boolean
    votes: Array<EdictVote>
}

interface EdictVote {
    playerId:string
    votes: number
    edictId:string
}

interface Bracket {
    uid:string
    round: number
    player1?: PlayerStats
    player2?: PlayerStats
}

interface AbilityData {
    type: import('./enum').Ability
    name: string
    description:string
    corp: import('./enum').Corporation
    special: import('./enum').SpecialEffect
    moraleCost: number
    moraleDmg: number
    soulCost: number
    soulDmg: number
    capitalCost: number
    capitalDmg: number
}

interface BuildHistory {
    abilities: Array<AbilityData>
}

interface PlayerStats {
    uid:string
    name:string
    avatarIndex:number
    employer: import('./enum').Corporation
    wins: Array<BuildHistory>
    build: Array<AbilityData>
    wagers: Array<Wager>
    votes: number
    tournamentId: string
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
}

interface ModalState { modal: import('./enum').Modal, data?: any }

interface RState {
    modalState: ModalState
    tournament: Tournament
    onlineAccount: PlayerStats
}