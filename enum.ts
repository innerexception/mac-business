export enum UIReducerActions { 
    LOGOUT,
    LOGIN_FAILED,
    HIDE_MODAL,
    MATCH_UPDATED,
    MATCH_CREATED,
    SHOW_MODAL,
    LOGIN_SUCCESS,
    MATCH_JOIN,
    UPDATE_NAME,
    LEAVE_MATCH,
    JOIN_EXISTING,
    MATCH_HOSTED,
    UPDATE_PLAYER,
    PLAYERS_UPDATED
}

export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '14px',
    color:'black',
}

export const PlayerColors = [
    '#1e90ff',
    '#ffa500',
    '#ff0000',
    '#008000',
    '#882D17',
    '#708090'
]

export enum Rounds {
    Danger, DoubleDanger, MostExtremeDanger
}

export const RoundNames = ['Danger', 'Double Danger', 'Most Extreme Danger']

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