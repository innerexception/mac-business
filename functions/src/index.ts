import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
import { EventContext } from "firebase-functions";

admin.initializeApp()

const resolveCurrentBrackets = async (context:EventContext) => {

}

export const onResolveCurrentBrackets = functions.pubsub.schedule('0/10 * * * *').onRun(resolveCurrentBrackets)
