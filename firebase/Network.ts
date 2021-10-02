// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase';
import { firebaseConfig } from './firebase.config.js'
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { Schemas } from './Schemas'
import { onLoginUser, onTournamentUpdated, onLogoutUser, onJoinExisting, onHideModal, onUpdatePlayer } from '../components/uiManager/Thunks';
import { getNewPlayer } from '../components/Util';
import { v4 } from 'uuid';
import { CloudFunctions, Edict } from '../enum';

firebase.initializeApp(firebaseConfig);

class Network {
    db: firebase.firestore.Firestore
    auth: firebase.auth.Auth
    functions: firebase.functions.Functions
    unsub: Function
    unsub2: Function

    constructor(){
        this.db = firebase.firestore()
        this.auth = firebase.auth()
        this.functions = firebase.functions()
        this.auth.onIdTokenChanged(async (user) => {
            if (user) {
                let userData = getNewPlayer(user.displayName, user.uid)
                let uref = await this.db.collection(Schemas.Collections.User.collectionName).doc(user.uid).get()
                if(uref.exists){
                    userData = uref.data() as PlayerStats
                }
                else this.db.collection(Schemas.Collections.User.collectionName).doc(user.uid).set(userData)
                const tourney = await this.getTournament()
                if(tourney){
                    onJoinExisting(userData, tourney)
                    this.subscribeToTourney(tourney.id, userData.uid)
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
    
    onUpdatePlayer = async (user:PlayerStats) => {
        await this.db.collection(Schemas.Collections.User.collectionName).doc(user.uid).set(user)
    }

    joinMatch = async (matchId:string, player:PlayerStats) => {
        let ref = await this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(matchId).get()
        if(ref.exists){
            let match = ref.data() as Tournament
            this.tryJoinTournament(player)
            this.subscribeToTourney(match.id, player.uid)
            onHideModal()
        }
    }

    getTournament = async () => {
        let ref = await this.db.collection(Schemas.Collections.Tournaments.collectionName).get()
        let Tournaments = ref.docs.map(d=>d.data() as Tournament)
        return Tournaments[0]
    }

    fetchEdicts = async () => {
        let ref = await this.db.collection(Schemas.Collections.Edicts.collectionName).get()
        return ref.docs.map(d=>d.data() as EdictData)
    }

    subscribeToTourney = (id:string, playerId:string) => {
        if(this.unsub) console.warn('uhh, already subscribed to a match??')
        this.unsub = this.db.collection(Schemas.Collections.Tournaments.collectionName).doc(id)
        .onSnapshot(
            (snap) => {
                let match = snap.data() as Tournament
                onTournamentUpdated(match)
            }
        )
        this.unsub2 = this.db.collection(Schemas.Collections.User.collectionName).doc(playerId)
        .onSnapshot(
            (snap) => {
                let pl = snap.data() as PlayerStats
                onUpdatePlayer(pl)
            }
        )
    }

    unsubscribeTourney = (playerId:string) => {
        if(this.unsub){
            this.unsub()
            this.unsub = null
            this.unsub2()
            this.unsub2 = null
            this.leaveTournament(playerId)
        }
    }

    leaveTournament = async (playerId:string) => {
       let res = await this.functions.httpsCallable(CloudFunctions.onPlayerLeave)({playerId})
       return res.data
    }

    tryJoinTournament = async (params:PlayerStats) => {
       let res = await this.functions.httpsCallable(CloudFunctions.onTryPlayerJoin)(params)
       return res.data
    }

    onSubmitBuild = async (params:PlayerStats) => {
       let res = await this.functions.httpsCallable(CloudFunctions.onSubmitPlayerBuild)(params)
       return res.data
    }

    onSubmitVotes = async (params:PlayerVoteParams) => {
       let res = await this.functions.httpsCallable(CloudFunctions.onSubmitPlayerVote)(params)
       return res.data
    }

    doSignInWithEmailAndPassword = (email:string, password:string) => this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()
}

let Provider = new Network()

export default Provider