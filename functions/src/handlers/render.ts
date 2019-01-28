import * as functions from 'firebase-functions';
import { app } from "firebase-admin";

import {ApplicationState} from '../../../models/states';
import Configuration from '../../../models/config';
import Sponsor from '../../../models/sponsor';

export default class PreRenderHandlers {

    private firestore: FirebaseFirestore.Firestore;

    constructor(firebase: app.App) {
        this.firestore = firebase.firestore();
    }

    private dataReducer = <T>() => (record: Record<string, T>, document: FirebaseFirestore.DocumentSnapshot): Record<string, T> => {
        record[document.id] = document.data() as T;
        return record;
    }

    private documentReducer = (record, document: FirebaseFirestore.DocumentSnapshot) => {
        record[document.id] = document;
        return record;
    };

    public render = async (_: functions.Request, response: functions.Response) => {
        const content = await Promise.all([
            this.firestore.doc('config/devfest').get(),
            this.firestore.collection('sessions').get(),
            this.firestore.collection('speakers').get(),
            this.firestore.collection('sponsors').get()
        ]);

        const state: ApplicationState = {
            current: {
                config: content[0].data() as Configuration,
                sponsors: content[3].docs.reduce(this.dataReducer<Sponsor>(), {})
            },
            speakers: {
                speakers: content[2].docs.reduce(this.documentReducer, {})
            },
            sessions: {
                sessions: content[1].docs.reduce(this.documentReducer, {})
            }
        };

        console.log(JSON.stringify(state.current));
        console.log(JSON.stringify(state.speakers));

        const eventName = `${state.current.config.event.city} ${state.current.config.event.name} ${state.current.config.event.year}`;
        
        response.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="x-ua-compatible" content="ie=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta name="theme-color" content="#4285F4">
                    <meta name="description" content="${state.current.config.event.description}">
            
                    <link rel="manifest" href="/manifest.json">
                    <link rel="icon" type="image/x-icon" href="favicon.ico">
            
                    <meta itemprop="name" content="${eventName}">
                    <meta itemprop="description" content="${state.current.config.event.description}">
                    <meta itemprop="image" content="assets/event-logo.svg">
            
                    <meta property="og:title" content="${eventName}">
                    <meta property="og:site_name" content="${eventName}">
                    <meta property="og:type" content="website">
                    <meta property="og:url" content="${state.current.config.event.url}">
                    <meta property="og:description" content="${state.current.config.event.description}">
                    <meta property="og:type" content="Event">
                    <meta property="og:image" content="assets/event-logo.svg">
                    <meta property="og:image:type" content="image/png">
            
                    <meta name="twitter:card" content="summary_large_image">
                    <meta name="twitter:creator" content="@gdg">
                    <meta name="twitter:title" content="${eventName}">
                    <meta name="twitter:description" content="${state.current.config.event.description}">
                    <meta name="twitter:image" content="assets/event-logo.svg">
            
                    <link href="scripts/Delorean-v88.css" rel="stylesheet">
                    <link async href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
                    <link async href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    
                    <script async src="https://www.eventbrite.com/static/widgets/eb_widgets.js"></script>
                    <title>${eventName}</title>
                </head>
            
                <body>
                    <div id='root' />
            
                    <script>
                        window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g,'\\u003c')}
                    </script>
                </body>
            </html>
        `);
    }

}