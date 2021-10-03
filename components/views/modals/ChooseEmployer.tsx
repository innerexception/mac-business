import * as React from 'react'
import { Button, TopBar } from '../../Shared';
import Provider from '../../../firebase/Network';
import { Corporations, Corporation, Corpos } from '../../../enum';
import { onHideModal } from '../../uiManager/Thunks';
import { connect } from 'react-redux';

interface Props {
    me?:PlayerStats
}

interface State {
    selectedIndex:number
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.tournament
})) as any)
export default class ChooseEmployer extends React.PureComponent<Props, State> {

    state:State = {
        selectedIndex: 0
    }

    increment = () => {
        this.setState({selectedIndex: (this.state.selectedIndex + 1) % Corpos.length})
    }

    tryJoin = async (employer:Corporation) => {
        let success = await Provider.tryJoinTournament({...this.props.me, employer }); 
        if(success) onHideModal()
    }

    render(){
        const employer = Corpos[this.state.selectedIndex] as Corporation
        const data = Corporations[employer] as CorpoData
        return (
            <div>
                <div style={{backgroundColor:data.color}}>
                    <h5>{data.name}</h5>
                    <h6>{data.description}</h6>
                    {Button(true, ()=>this.tryJoin(employer), 'Sign Handbook (in blood)')}
                </div>
                {Button(true, this.increment, '->')}
            </div>
        )
    }
}