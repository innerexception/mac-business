import { v4 } from 'uuid';
import { Avatars } from '../enum';

enum FirebaseAuthError {
    NOT_FOUND='auth/user-not-found',
    BAD_EMAIL='auth/invalid-email',
    BAD_PASSWORD='auth/wrong-password'
}

export const between = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);

export const getErrorMessage = (error:string) => {
    switch(error){
        case FirebaseAuthError.BAD_EMAIL: return 'Invalid email address'
        case FirebaseAuthError.BAD_PASSWORD: return 'Password was incorrect'
        case FirebaseAuthError.NOT_FOUND: return 'No account exists with that email, create one now'
        default: return 'Something happened'
    }
}

export const getNewPlayer = (name:string, uid:string):PlayerStats => {
    return {
        uid,
        name,
        avatarIndex:between(0,Avatars.length-1),
        wins: 0
    }
}

export const shuffle = (array:Array<any>) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const getNextPlayerId = (players:Array<PlayerStats>, activeId:string) => {
    let i = players.findIndex(p=>p.uid === activeId)
    return players[(i+1)%players.length].uid
}