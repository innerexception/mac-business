declare enum Rounds {
    Danger=0, DoubleDanger=1, MostExtremeDanger=2
}

interface Match {
    id:string
    hostId:string
    activePlayerId:string
    activeQuestion: Question
    round: import('./enum').Rounds
    roundCategories: RoundCategories
    isStarted:boolean
}

interface RoundCategories {
    [Rounds.Danger]: {categories: Array<string>, questions: Array<Question>}
    [Rounds.DoubleDanger]: {categories: Array<string>, questions: Array<Question>}
    [Rounds.MostExtremeDanger]: {categories: Array<string>, questions: Array<Question>}
}

interface Question {
    id:string
    category: string
    value: string
    question: string
    answer: string
    round: string
    air_date: string
    show_number:number
    bonus: boolean
}

interface PlayerState {
    uid:string
    name:string
    avatarIndex:number
    isBuzzed: boolean
    answers: number
    correctAnswers: number
    streak: number
    currentWinnings: number
    totalWinnings: number
}

interface RState {
    modalState: import('./enum').Modal
    modalData: any
    match: Match
    players: Array<PlayerState>
    onlineAccount:PlayerState
}