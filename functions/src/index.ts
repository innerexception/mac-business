import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
import { EventContext } from "firebase-functions";
import { CallableContext } from "firebase-functions/v1/https";
import {Schemas} from '../../firebase/Schemas'
import { v4 } from "uuid";
import { Abilities } from "../../enum";

admin.initializeApp()

const resolveCurrentBrackets = async (context:EventContext) => {
    let tourney = await getTournament()
    if(tourney.hasEnded){
        const newTourney = getNewTournament()
        await updateTournament(newTourney)
        tourney = newTourney
    }

    if(tourney.hasStarted){
        //if there is an active tournament, calculate all brackets and advance/remove players
        const brackets = resolveBrackets(tourney.brackets)
        if(tourney.activeRound === tourney.finalRound){
            //end it after resolving
            await updateTournament({
                ...tourney, 
                hasEnded: true,
                brackets
            })
        }
        else {
            //else advance to next
            await updateTournament({
                ...tourney, 
                activeRound: tourney.activeRound+1,
                brackets
            })
        }
    }
    else {
        //else, check if there are enough players to start a tournament
        if(tourney.brackets.length >= 4){
            //if so, start it
            await updateTournament({...tourney, hasStarted:true})
        }
        else {
            //else, do nothing and update the timestamp
            await updateTournament({...tourney, lastCheck: Date.now()})
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
    //see if the tournament is active. If so, do nothing. If not, add player to next available bracket (or generate a new bracket), using employer and uid.
    let tourney = await getTournament()
    if(tourney.hasStarted) return false
    else {
        const newPlayer:PlayerStats = {
            ...params.player,
            wins: [],
            build: [],
            tournamentId: tourney.id
        }
        const availableBracket = tourney.brackets.find(b=>!b.player2 || !b.player1)
        if(availableBracket){
            if(!availableBracket.player1) availableBracket.player1 = newPlayer
            else availableBracket.player2 = newPlayer
        }
        else {
            tourney.brackets.push({
                uid: v4(),
                round: 0,
                player1: newPlayer
            })
        }
        await updateTournament(tourney)
        return true
    }
}

const playerLeft = async (params:{playerId:string}, ctx:CallableContext) => {
    //remove player from tournament if it has not yet started. Remove the bracket if empty. Otherwise do nothing.
    let tourney = await getTournament()
    if(!tourney.hasStarted){
        tourney.brackets.forEach(b=>{
            if(b.player1?.uid === params.playerId) delete b.player1
            if(b.player2?.uid === params.playerId) delete b.player2
        })
        tourney.brackets = tourney.brackets.filter(b=>b.player1 || b.player2)
        await updateTournament(tourney)
    }
}

const submitPlayerBuild = async (params:{player:PlayerStats}, ctx:CallableContext) => {
    //replace the player's current build using ability ids only
    let player = await getPlayer(ctx.auth?.uid)
    if(player){
        player.build = params.player.build.map(b=>Abilities[b.type])
        await updatePlayer(player)
    }
}

const submitPlayerWager = async (params:Wager, ctx:CallableContext) => {
    //replace the player's current bet on the given bracket
    let player = await getPlayer(ctx.auth?.uid)
    if(player){
        player.wagers = player.wagers.filter(w=>w.bracketId !== params.bracketId)
        player.wagers.push(params)
        await updatePlayer(player)
    }
}

const getTournament = async () => {
    let ref = await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').get()
    if(!ref.exists){
        const newTourney = getNewTournament()
        await updateTournament(newTourney)
        return newTourney
    } 
    return ref.data() as Tournament
}

const updateTournament = async (tournament:Tournament) => {
    await admin.firestore().collection(Schemas.Collections.Tournaments.collectionName).doc('thing1').set(tournament)
}

const getPlayer = async (playerId?:string) => {
    if(playerId){
        let ref = await admin.firestore().collection(Schemas.Collections.User.collectionName).doc(playerId).get()
        return ref.data() as PlayerStats
    }
    return undefined
}

const updatePlayer = async (player:PlayerStats) => {
    await admin.firestore().collection(Schemas.Collections.User.collectionName).doc(player.uid).set(player)
}

const getNewTournament = ():Tournament => {
    return {
        id:v4(),
        activeRound: 0,
        finalRound: 0,
        brackets: [],
        hasStarted:false,
        hasEnded:false,
        lastCheck: Date.now()
    }
}

export const onResolveCurrentBrackets = functions.pubsub.schedule('0/10 * * * *').onRun(resolveCurrentBrackets)
export const onTryPlayerJoin = functions.https.onCall(tryPlayerJoin)
export const onPlayerLeave = functions.https.onCall(playerLeft)
export const onSubmitPlayerBuild= functions.https.onCall(submitPlayerBuild)
export const onSubmitPlayerWager= functions.https.onCall(submitPlayerWager)
