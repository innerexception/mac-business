export enum UIReducerActions { 
    LOGOUT,
    LOGIN_FAILED,
    HIDE_MODAL,
    MATCH_UPDATED,
    SHOW_MODAL,
    LOGIN_SUCCESS,
    UPDATE_NAME,
    LEAVE_MATCH,
    JOIN_EXISTING,
    UPDATE_PLAYER
}

export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '14px',
    color:'black',
}

export enum CloudFunctions {
    onTryPlayerJoin='onTryPlayerJoin',
    onPlayerLeave='onPlayerLeave',
    onSubmitPlayerBuild='onSubmitPlayerBuild',
    onSubmitPlayerWager='onSubmitPlayerWager'
}

export enum Ability {

}

export const Abilities:Record<Ability, AbilityData> = {

}

export enum SpecialEffect {
    
}

export enum Corporation {
    Wernstern='Wernstern Media',
    Rontheon='Rontheon Arma',
    HellBank='Hells Fargo Bank',
    McKillsie='McKillsie Consulting',
    Elysium='Elysium Medical Group',
    PardonPharma='PardonPharma'
}

export const Corporations:Record<Corporation, CorpoData> = {
    [Corporation.Elysium]: {
        color:'0x0000ff',
        description: "Leading innovations in extra dimensional health therapies. Join tomorrow's eternity today!",
        name: 'Elysium Medical Group'
    },
    [Corporation.HellBank]: {
        color:'0xff0000',
        name: "Hell's Fargo Financial",
        description: 'Got cash? Not for long!'
    },
    [Corporation.McKillsie]: {
        color:'0xcccccc',
        description: 'McKillsie Consulting has a proven track record of turning successful firms into decomposing yet still living piles of organic matter.',
        name: 'McKillsie Consulting' 
    },
    [Corporation.PardonPharma]: {
        color:'0xff00ff',
        name: 'PardonPharma',
        description: 'Like if El Chapo had lobbyists.'
    },
    [Corporation.Rontheon]: {
        color:'0xff0000',
        name: 'Rontheon Defense',
        description: 'A proven track record of turning successful countries and individuals into smoking heaps of gory ash.'
    },
    [Corporation.Wernstern]: {
        color:'0x00ff00',
        name: 'Wernstern Media',
        description: 'If you read it, we wrote it.'
    },
}

export enum Modal {
    HELP,
    MENU,
    SCORES,
    LOBBY,
    INFO,
    EDIT_BUILD,
    CHOOSE_EMPLOYMENT
}

export const Avatars = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z',
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z',
]