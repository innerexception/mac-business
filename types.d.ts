interface Tournament {
    id:string
    activeBracket: number
    finalBracket: number
    brackets: Array<Bracket>
    hasStarted:boolean
}

interface Bracket {
    uid:string
    round: number
    player1: PlayerStats
    player2: PlayerStats
}

interface Ability {
    name:string
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
    abilities: Array<Ability>
}

interface PlayerStats {
    uid:string
    name:string
    avatarIndex:number
    employer: import('./enum').Corporation
    wins: Array<BuildHistory>
    build: Array<Ability>
    tournamentId: string
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