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

const intro = [
    "Welcome to our family. We are so excited to meat you, and hope you are ready to participate in the global Soul Harvest team building tournament!",
    "As you know, in today's marketplace we need the help of our extra dimensional friends to keep meeting our numbers!",
    "We hope you will do your best to represent the values our company represents and be your best and most authentic self!"
]

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
                <div style={{height:'400px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                    <h2 style={{textAlign:'center'}}>Welcome new Employee!!</h2>
                    <h6 style={{margin:'2em'}}><Dialog messages={intro}/></h6>
                    {this.state.error && <h4 style={{color:'white'}}>{this.state.error}</h4>}
                    <div>
                        <div style={{display:'flex', justifyContent:'center', marginTop:'0.5em'}}>
                            <div>{Button(!this.state.isLogginIn, this.trySignIn, 'Accept Terms')}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
