import * as React from 'react'
import { Button, TopBar } from '../../Shared';
import Provider from '../../../firebase/Network';
import { Corporations, Corporation, Corpos } from '../../../enum';
import { onHideModal } from '../../uiManager/Thunks';
import { connect } from 'react-redux';
import AppStyles from '../../../AppStyles';

interface Props {
    me?:PlayerStats
}

interface State {
    selectedIndex:number
    name:string
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class ChooseEmployer extends React.PureComponent<Props, State> {

    state:State = {
        selectedIndex: 0,
        name:this.props.me.name || 'New Employee'
    }

    increment = () => {
        this.setState({selectedIndex: (this.state.selectedIndex + 1) % Corpos.length})
    }

    tryJoin = async (employer:Corporation) => {
        let success = await Provider.tryJoinTournament({...this.props.me, employer, name:this.state.name }); 
        if(success) onHideModal()
    }

    render(){
        const employer = Corpos[this.state.selectedIndex] as Corporation
        const data = Corporations[employer] as CorpoData
        return (
            <div style={{...AppStyles.modal, ...AppStyles.centered}}>
                <div style={{backgroundColor:data.color}}>
                    <div>
                        <h6 style={{whiteSpace:'pre-wrap', fontSize:'6px'}}>{data.logo}</h6>
                    </div>
                    <h5>{data.name}</h5>
                    <h6>{data.description}</h6>
                    {Button(true, this.increment, 'Next ->')}
                </div>
                <div>
                    <input value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                </div>
                <div style={{display:"flex"}}>
                    {Button(true, ()=>this.tryJoin(employer), 'Sign Handbook (in blood)')}
                    {Button(true, onHideModal, 'Nevermind')}
                </div>
            </div>
        )
    }
}