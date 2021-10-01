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

export const CorpoData:Record<Corporation, CorpoData> = {
    [Corporation.Elysium]: {color:'0x0000ff'},
    [Corporation.HellBank]: {color:'0xff0000'},
    [Corporation.McKillsie]: {color:'0xcccccc'},
    [Corporation.PardonPharma]: {color:'0xff00ff'},
    [Corporation.Rontheon]: {color:'0xff0000'},
    [Corporation.Wernstern]: {color:'0x00ff00'},
}

export enum Modal {
    HELP,
    MENU,
    SCORES,
    LOBBY,
    QUESTION,
    MATCHES,
    JUDGEMENT,
    NO_ANSWERS,
    INFO,
    NEW_ROUND
}

export const Avatars = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z',
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z',
]