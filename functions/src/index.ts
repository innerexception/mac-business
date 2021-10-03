import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
import { EventContext } from "firebase-functions";
import { CallableContext } from "firebase-functions/v1/https";
import {Schemas} from '../../firebase/Schemas'
import { v4 } from "uuid";
import { Ability, Corporations, Edict } from "../../enum";
import { Abilities } from "./Abilities";

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
        const players = await getPlayers()
        const brackets = resolveBrackets(tourney.brackets, players, tourney.activeRound+1)
        const roundBrackets = brackets.filter(b=>b.round === tourney.activeRound+1)
        if(roundBrackets.length === 0){
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

const resolveBrackets = (brackets:Array<Bracket>, players:Array<PlayerStats>, nextRound:number) => {

    let messages = []

    brackets.forEach(b=>{
        //1. Resolve each bracket
        //TODO: Apply edicts as appropriate
        let p1 = players.find(p=>p.uid === b.player1Id)
        let p2 = players.find(p=>p.uid === b.player2Id)
        if(p1 && p2){
            while(p1.morale > 0 && p2.morale > 0 && p1.capital < 10 && p2.capital < 10){
                //Resolve builds
                resolveBracket(p1,p2)
            }

            //Now Somebody is at 0 morale or 10 cap (could both be eliminated) in this bracket
            //Player 1
            if(p1.morale<=0 ){
                messages.push({ text: p1.name+' was driven insane by '+p2.name})
                delete b.player1Id
            }
            else if(p1.soul <= 0){
                //3. Check for devouring
                if(Math.random() <= 0.1 + Math.abs(0.1*p1.soul)){
                    messages.push({ text: p1.name+' was devoured!'})
                    delete b.player1Id
                }
            }
            else if(p1.capital >= 10 && p1.capital > p2.capital){
                messages.push({ text: p1.name+' bought out '+p2.name})
            }

            //Player 2
            if(p2.morale<=0){
                messages.push({ text: p2.name+' was driven insane by '+p1.name})
                delete b.player2Id
            }
            else if(p2.soul <= 0){ 
                //3. Check for devouring
                if(Math.random() <= 0.1 + Math.abs(0.1*p2.soul)){
                    messages.push({ text: p2.name+' was devoured!'})
                    delete b.player2Id
                }
            }
            else if(p2.capital >= 10 && p2.capital > p1.capital){
                messages.push({ text: p2.name+' bought out '+p1.name})
            }

            let winnerId=''

            //Now there should be only 1 player in each bracket. Update player win history
            if(b.player1Id){
                winnerId = b.player1Id
                p1.currentWins.push({abilities: p1.build})
            }
            else if(b.player2Id){
                winnerId = b.player2Id
                p2.currentWins.push({abilities: p2.build})
            }

            //Now Pay out winners of bracket
            if(winnerId){
                players.forEach(p=>{
                    if(p.uid === winnerId) p.wins++
                    const wager = p.wagers.find(w=>w.bracketId===b.uid && w.playerToWin === winnerId)
                    if(wager){
                        p.votes += (wager.amount * b.odds)
                        p.wagers = p.wagers.filter(w=>w.bracketId !== b.uid)
                    }
                })
            }
        }
    })

    //Save updated player info
    for(let player of players){
        admin.firestore().collection(Schemas.Collections.User.collectionName).doc(player.uid).set(player)
    }

    //Generate new brackets
    let nBrackets = new Array<Bracket>()
    let remainingPlayers = brackets.map(b=>{
        if(b.player1Id) return b.player1Id
        if(b.player2Id) return b.player2Id
        return
    }).filter(p=>p ? true: false)

    if(remainingPlayers.length === 1) return brackets

    for(let i=0; i < remainingPlayers.length; i+=2){
        nBrackets.push({
            uid: v4(),
            round: nextRound,
            odds: 1, //TODO: varies by player win ratio difference
            player1Id: remainingPlayers[i],
            player2Id: remainingPlayers[i+1]
        })
    }

    //TODO: send messages

    return brackets.concat(nBrackets)
}

const resetPlayerResources = (pl:PlayerStats):PlayerStats => {
    return {
        ...pl,
        soul: Corporations[pl.employer].soul,
        morale: Corporations[pl.employer].morale,
        capital: Corporations[pl.employer].capital
    }
}

const resolveBracket = (p1:PlayerStats, p2:PlayerStats) => {
    p1.build.forEach(a=>{
        p1.capital -= a.capitalCost
        p1.capital += a.capitalGain
        p1.morale -= a.moraleCost
        p1.morale += a.moraleGain
        p1.soul -= a.soulCost
        p1.soul += a.soulGain
        p2.capital -= a.capitalDmg
        p2.morale -= a.moraleDmg
        p2.soul -= a.soulDmg
        resolveSpecial(a.type, p1, p2)
    })
    p2.build.forEach(a=>{
        p2.capital -= a.capitalCost
        p2.capital += a.capitalGain
        p2.morale -= a.moraleCost
        p2.morale += a.moraleGain
        p2.soul -= a.soulCost
        p2.soul += a.soulGain
        p1.capital -= a.capitalDmg
        p1.morale -= a.moraleDmg
        p1.soul -= a.soulDmg
        resolveSpecial(a.type, p2, p1)
    })
}

const resolveSpecial = (ability:Ability, attacker:PlayerStats, defender:PlayerStats) => {
    //TODO
}

const tryPlayerJoin = async (params:PlayerStats, ctx:CallableContext) => {
    //see if the tournament is active. If so, do nothing. If not, add player to next available bracket (or generate a new bracket), using employer and uid.
    let tourney = await getTournament()
    if(tourney.hasStarted) return false
    else {
        let newPlayer:PlayerStats = {
            ...params,
            currentWins: [],
            build: [],
            tournamentId: tourney.id
        }
        newPlayer = resetPlayerResources(newPlayer)
        await updatePlayer(newPlayer)
        const availableBracket = tourney.brackets.find(b=>!b.player2Id || !b.player1Id)
        if(availableBracket){
            if(!availableBracket.player1Id) availableBracket.player1Id = newPlayer.uid
            else availableBracket.player2Id = newPlayer.uid
        }
        else {
            tourney.brackets.push({
                uid: v4(),
                round: 0,
                odds: 1, //TODO: varies by player win ratio difference
                player1Id: newPlayer.uid
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
            if(b.player1Id === params.playerId) delete b.player1Id
            if(b.player2Id === params.playerId) delete b.player2Id
        })
        tourney.brackets = tourney.brackets.filter(b=>b.player1Id || b.player2Id)
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

const submitNewPlayer = async (params:PlayerStats, ctx:CallableContext) => {
    if(ctx.auth)
        await admin.firestore().collection(Schemas.Collections.User.collectionName).doc(ctx.auth.uid).set(params)
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

const getPlayers = async () => {
    let ref = await admin.firestore().collection(Schemas.Collections.User.collectionName).get()
    return ref.docs.map(d=>d.data() as PlayerStats)
}

const updatePlayer = async (player:PlayerStats) => {
    await admin.firestore().collection(Schemas.Collections.User.collectionName).doc(player.uid).set(player)
}

const getNewTournament = ():Tournament => {
    return {
        id:v4(),
        activeRound: 0,
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

export const onResolveCurrentBrackets = functions.pubsub.schedule('0 0 * * *').onRun(resolveCurrentBrackets)
export const onTryPlayerJoin = functions.https.onCall(tryPlayerJoin)
export const onPlayerLeave = functions.https.onCall(playerLeft)
export const onSubmitPlayerBuild= functions.https.onCall(submitPlayerBuild)
export const onSubmitPlayerWager= functions.https.onCall(submitPlayerWager)
export const onSubmitPlayerVote= functions.https.onCall(submitPlayerVote)
export const onSubmitNewPlayer=functions.https.onCall(submitNewPlayer)
