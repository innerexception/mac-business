interface Tournament {
    id:string
    activeBracket: number
    brackets: Array<Bracket>
}

interface Bracket {
    uid:string
    round: number
    player1: PlayerBuild
    player2: PlayerBuild
}

interface Ability {
    corp: import('./enum').Corporation
    special: import('./enum').SpecialEffect
    moraleCost: number
    moraleDmg: number
    soulCost: number
    soulDmg: number
    capitalCost: number
    capitalDmg: number
}

interface PlayerBuild {
    playerId:string
    abilities: Array<Ability>
}

interface PlayerStats {
    uid:string
    name:string
    avatarIndex:number
    wins: number
}

interface CorpoData {
    color: string
}

interface ModalState { modal: import('./enum').Modal, data?: any }

interface RState {
    modalState: ModalState
    tournament: Tournament
    onlineAccount: PlayerStats
}