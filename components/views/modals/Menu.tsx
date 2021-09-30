import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button } from '../../Shared';
import { getErrorMessage } from '../../Util';
import Provider from '../../../firebase/Network';
import { v4 } from "uuid";
import Dialog from '../Dialog';

interface Props {}

interface State {
    isLogginIn:boolean
    error:string
}

export default class Menu extends React.Component<Props, State> {

    state = { isLogginIn: false, error: '' }

    trySignIn = async () => {
        try{
            this.setState({isLogginIn:true})
            await Provider.onCreateUser(v4()+'@gmail.com', v4())
        }
        catch(e){
            this.setState({isLogginIn:false, error: getErrorMessage(e.code)})
        }
    }

    render(){
        return (
            <div style={{...AppStyles.modal, ...AppStyles.centered}}>
                <div>
                    <h1><Dialog messages={['Most']}/></h1>
                    <h1 style={{marginLeft:'1em'}}><Dialog messages={['Extreme']}/></h1>
                    <h1 style={{marginLeft:'2em'}}><Dialog messages={['Danger!!']}/></h1>
                    {this.state.error && <h4 style={{color:'white'}}>{this.state.error}</h4>}
                    <div>
                        <div style={{display:'flex', justifyContent:'center', marginTop:'0.5em'}}>
                            <div style={{width:'100px', marginLeft:'1em'}}>{Button(!this.state.isLogginIn, this.trySignIn, 'Continue')}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
