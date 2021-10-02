import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
import { EventContext } from "firebase-functions";
import { CallableContext } from "firebase-functions/v1/https";
import {Schemas} from '../../firebase/Schemas'
import { v4 } from "uuid";
import { Abilities, Edict } from "../../enum";

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
            //start voting on edicts
            await updateTournament({
                ...tourney, 
                isVoting: true,
                brackets
            })
        }
        else if(tourney.isVoting){
            //end it and save voting result
            await updateTournament({
                ...tourney, 
                hasEnded: true
            })
            let votedModifier = await getHighestEdict()
            await admin.firestore().collection(Schemas.Collections.Edicts.collectionName).doc(votedModifier).set({active: true})
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
    brackets.forEach(b=>{
        //1. Resolve each bracket
        //TODO: Apply edicts as appropriate
        let p1 = b.player1 as PlayerStats
        let p2 = b.player2 as PlayerStats
        p1?.build.forEach(a=>{
            p1.capital -= a.capitalCost
            p1.morale -= a.moraleCost
            p1.soul -= a.soulCost
            p2.capital -= a.capitalDmg
            p2.morale -= a.moraleDmg
            p2.soul -= a.soulDmg
            if(a.special) resolveSpecial(a.special, p1, p2)
        })
        p2?.build.forEach(a=>{
            p2.capital -= a.capitalCost
            p2.morale -= a.moraleCost
            p2.soul -= a.soulCost
            p1.capital -= a.capitalDmg
            p1.morale -= a.moraleDmg
            p1.soul -= a.soulDmg
            if(a.special) resolveSpecial(a.special, p2, p1)
        })
        if(p1.morale > 0 && p2.morale > 0){
            //Resolve builds again

        }
        else {
            //Somebody is at 0 morale (could both be eliminated)

        }
        //TODO: 2. Check for devouring
        //TODO: 3. Update player win history
        //TODO: 4. Pay out wagers (don't get paid if devoured)
        //TODO: 5. generate new brackets
    })
    return brackets
}

const tryPlayerJoin = async (params:PlayerStats, ctx:CallableContext) => {
    //see if the tournament is active. If so, do nothing. If not, add player to next available bracket (or generate a new bracket), using employer and uid.
    let tourney = await getTournament()
    if(tourney.hasStarted) return false
    else {
        const newPlayer:PlayerStats = {
            ...params,
            wins: [],
            build: [],
            tournamentId: tourney.id,
            soul:10, //TODO: varies by corpo
            morale:10,
            capital:0
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

const submitPlayerBuild = async (params:PlayerStats, ctx:CallableContext) => {
    //replace the player's current build using ability ids only
    let player = await getPlayer(ctx.auth?.uid)
    if(player){
        player.build = params.build.map(b=>Abilities[b.type])
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

const submitPlayerVote = async (params:PlayerVoteParams, ctx:CallableContext) => {
    let player = await getPlayer(ctx.auth?.uid)
    if(player){
        player.pendingVote=params.edict
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
        lastCheck: Date.now(),
        isVoting: false
    }
}

interface VotesHash {
    [thing:string]:number
}

const getHighestEdict = async () => {

    let playersRef = await admin.firestore().collection(Schemas.Collections.User.collectionName).get()
    const players = playersRef.docs.map(d=>d.data() as PlayerStats)

    let voteHash = {} as VotesHash
    players.forEach(p=>{
        if(!voteHash[p.pendingVote]) voteHash[p.pendingVote] = 0
        else voteHash[p.pendingVote]+=p.votes
    })
    let leaderVotes = 0
    let leaderEdict = ''
    for(let edict in voteHash){
        if(voteHash[edict] > leaderVotes){
            leaderVotes = voteHash[edict]
            leaderEdict = edict
        }
    }

    for(let player of players){
        admin.firestore().collection(Schemas.Collections.User.collectionName).doc(player.uid).set({...player, votes: 0, pendingVote: null })
    }

    return leaderEdict as Edict
}

export const onResolveCurrentBrackets = functions.pubsub.schedule('0/10 * * * *').onRun(resolveCurrentBrackets)
export const onTryPlayerJoin = functions.https.onCall(tryPlayerJoin)
export const onPlayerLeave = functions.https.onCall(playerLeft)
export const onSubmitPlayerBuild= functions.https.onCall(submitPlayerBuild)
export const onSubmitPlayerWager= functions.https.onCall(submitPlayerWager)
export const onSubmitPlayerVote= functions.https.onCall(submitPlayerVote)
