// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase';
import { firebaseConfig } from './firebase.config.js'
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/firestore';
import { Schemas } from './Schemas'
import { onLoginUser, onMatchUpdated, onLogoutUser, onMatchJoin, onJoinExisting, onMatchHosted, onPlayersUpdated } from '../components/uiManager/Thunks';
import { between, getNewMatchObject, getNewPlayer } from '../components/Util';

import { Rounds } from '../enum';
import { v4 } from 'uuid';

firebase.initializeApp(firebaseConfig);

class Network {
    db: firebase.firestore.Firestore
    auth: firebase.auth.Auth
    unsub: Function
    unsub2: Function

    constructor(){
        this.db = firebase.firestore()
        this.auth = firebase.auth()
        this.auth.onIdTokenChanged(async (user) => {
            if (user) {
                let userData = getNewPlayer(user.displayName, user.uid)
                let uref = await this.db.collection(Schemas.Collections.User.collectionName).doc(user.uid).get()
                if(uref.exists){
                    userData = uref.data() as PlayerState
                }
                else this.db.collection(Schemas.Collections.User.collectionName).doc(user.uid).set(userData)
                let ref = await this.db.collection(Schemas.Collections.Tournaments.collectionName).get()
                let Tournaments = ref.docs.map(d=>d.data() as Match)
                let existingMatch
                for(let match of Tournaments){
                    let player = await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(match.id).collection('players').doc(user.uid).get()
                    if(player.exists) existingMatch = match
                }
                if(existingMatch){
                    onJoinExisting(userData, existingMatch)
                    this.subscribeToMatch(existingMatch.id)
                    return
                }
                let existingHost = Tournaments.find(m=>m.hostId === user.uid)
                if(existingHost){
                    onJoinExisting(userData, existingHost)
                    this.subscribeToMatch(existingHost.id)
                    return
                }
                onLoginUser(userData)
            } else {
                onLogoutUser()
            }
        });
    }
    logoutUser = () => {
        this.auth.signOut()
    }
    onTrySignIn = async (email:string, password:string) => {
        await this.auth.signInWithEmailAndPassword(email, password)
    }
    onCreateUser = async (email:string, password:string) => {
        await this.auth.createUserWithEmailAndPassword(email, password)
    }
    
    createMatch = async (hostId:string) => {
        let match = getNewMatchObject(hostId)
        let existing = await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(match.id).get()
        if(existing.exists) await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc((existing.data() as Match).id).delete()
        await this.upsertMatch(match)
        onMatchHosted(match)
        this.subscribeToMatch(match.id)
        return match
    }
    
    onUpdatePlayer = async (user:PlayerState) => {
        await this.db.collection(Schemas.Collections.User.collectionName).doc(user.uid).set(user)
    }

    joinMatch = async (matchId:string, player:PlayerState) => {
        let ref = await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(matchId).get()
        if(ref.exists){
            let match = ref.data() as Match
            onMatchJoin(match)
            this.subscribeToMatch(match.id)
            this.upsertPlayer(match, player)
        }
    }

    deleteMatch = async (matchId:string) => {
        await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(matchId).delete()
    }

    subscribeToMatch = (id:string) => {
        if(this.unsub) console.warn('uhh, already subscribed to a match??')
        this.unsub = this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(id)
        .onSnapshot(
            (snap) => {
                let match = snap.data() as Match
                onMatchUpdated(match)
            }
        )
        this.unsub2 = this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(id).collection('players')
        .onSnapshot(
            (snap) => {
                let players = snap.docs.map(d=>d.data() as PlayerState)
                onPlayersUpdated(players)
            }
        )
    }

    unsubscribeMatch = (match:Match, playerId:string) => {
        if(this.unsub){
            this.unsub()
            this.unsub2()
            this.unsub2 = null
            this.unsub = null
            this.deletePlayer(match, playerId)
        }
    }

    upsertMatch = async (match:Match) => {
        await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(match.id).set(match)
    }

    deletePlayer = (match:Match, playerId:string) => {
        this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(match.id).collection('players').doc(playerId).delete()
    }

    upsertPlayer = (match:Match, player:PlayerState) => {
        this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(match.id).collection('players').doc(player.uid).set(player)
    }

    upsertPlayers = async (match:Match, players:Array<PlayerState>) => {
        let batch = this.db.batch()
        players.forEach(player=>batch.set(this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(match.id).collection('players').doc(player.uid), player))
        batch.commit()
    }

    doSignInWithEmailAndPassword = (email:string, password:string) => this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()
}

let Provider = new Network()

export default Provider