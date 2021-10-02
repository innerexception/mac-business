import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
import { EventContext } from "firebase-functions";
import { CallableContext } from "firebase-functions/v1/https";
import {Schemas} from '../../firebase/Schemas'
import { v4 } from "uuid";

admin.initializeApp()

const resolveCurrentBrackets = async (context:EventContext) => {
    let tourney = await getTournament()
    if(!tourney || tourney.hasEnded){
        await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').set(getNewTournament())
        tourney = await getTournament()
    }

    if(tourney.hasStarted){
        //if there is an active tournament, calculate all brackets and advance/remove players
        const brackets = resolveBrackets(tourney.brackets)
        if(tourney.activeBracket === tourney.finalBracket){
            //end it after resolving
            await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').set({
                ...tourney, 
                hasEnded: true,
                brackets
            })
        }
        else {
            //else advance to next
            await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').set({
                ...tourney, 
                activeBracket: tourney.activeBracket+1,
                brackets
            })
        }
        
    }
    else {
        //else, check if there are enough players to start a tournament
        if(tourney.brackets.length >= 4){
            //if so, start it
            await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').set({...tourney, hasStarted:true})
        }
        else {
            //else, do nothing and update the timestamp
            await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').set({...tourney, nextCheck: Date.now()})
        }
    }
}

const resolveBrackets = (brackets:Array<Bracket>) => {
    //TODO: resolve each bracket and pay out wagers
    brackets.forEach(b=>{
        
    })
    return brackets
}

const tryPlayerJoin = async (params:{player:PlayerStats}, ctx:CallableContext) => {
    //TODO: see if the tournament is active. If so, do nothing. If not, add player to next available bracket (or generate a new bracket), using employer and uid.
}

const playerLeft = async (params:{playerId:string}, ctx:CallableContext) => {
    //TODO: remove player from tournament if it has not yet started. Remove the bracket if empty. Otherwise do nothing.
}

const submitPlayerBuild = async (params:{player:PlayerStats}, ctx:CallableContext) => {
    //TODO: replace the player's current build using ability ids only
}

const submitPlayerWager = async (params:{bracketId:string, amount:number}, ctx:CallableContext) => {
    //TODO: replace the player's current bet on the given bracket
}

const getTournament = async () => {
    let ref = await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).get()
    return ref.docs[0].data() as Tournament
}

const getNewTournament = ():Tournament => {
    return {
        id:v4(),
        activeBracket: 0,
        finalBracket: 0,
        brackets: [],
        hasStarted:false,
        hasEnded:false
    }
}

export const onResolveCurrentBrackets = functions.pubsub.schedule('0/10 * * * *').onRun(resolveCurrentBrackets)
export const onTryPlayerJoin = functions.https.onCall(tryPlayerJoin)
export const onPlayerLeave = functions.https.onCall(playerLeft)
export const onSubmitPlayerBuild= functions.https.onCall(submitPlayerBuild)
export const onSubmitPlayerWager= functions.https.onCall(submitPlayerWager)
