import * as React from 'react';
import { TopBar, Button } from '../Shared'
import AppStyles from '../../AppStyles';
const matchMusic = require('../../sounds/matchMusic.mp3')
const victory = require('../../sounds/victoryMusic.mp3')
const loss = require('../../sounds/lossMusic.mp3')
const phraseChange = require('../../sounds/phraseChange.mp3')

export default class Match extends React.Component {

    state = {
        
    }

    render(){
        return (
            <div style={styles.frame}>
                {TopBar('MacBusiness')}
                <div style={{padding:'0.5em'}}>
                    <div style={{marginBottom:'1em'}}> Corp</div>
                    <div>Brainstorming in Conference room 3F</div>
                    
                </div>
            </div>
        )
    }
}

const styles = {
    frame: {
        width:'500px',
        backgroundImage: 'url('+require('../assets/tiny2.png')+')',
        backgroundRepeat: 'repeat',
        border:'1px solid',
        borderTopLeftRadius:'5px',
        borderTopRightRadius: '5px'
    },
    barFill1: {
        backgroundImage: 'url('+require('../assets/tiny2.png')+')',
        backgroundRepeat: 'repeat',
    },
    barFill2: {
        backgroundImage: 'url('+require('../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
    },
    choiceBtn: {
        margin: 0,
        cursor: 'pointer',
        border: '1px solid',
        padding: '0.5em',
        borderRadius: '5px',
        marginBottom:'1em'
    }
}