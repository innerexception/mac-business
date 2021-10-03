import * as React from 'react'
import Tooltip from 'rc-tooltip'

interface Props {
    history: Array<BuildHistory>
}

export default (props:Props) => 
    <div>
        {props.history.length ? 
        props.history.map((h,i)=>
            <div>
                <h5>Round {i}</h5>
                {h.abilities.map((a,i)=>
                <Tooltip overlay={<AbilityTooltip ability={a}/>}>
                    <div>{i} - {a.name}</div>
                </Tooltip>
                )}
        </div>) :
        <h6>No wins yet...</h6>
        }
    </div>
        
interface TipProps {
    ability:AbilityData
}

export const AbilityTooltip = ({ability}:TipProps) => 
    <div>
        <h5>{ability.name}</h5>
        <h6>{ability.description}</h6>
        <h6>(cost) / (dmg) / (leech)</h6>
        <h6>Capital: {ability.capitalCost|| '-'} / {ability.capitalDmg|| '-'} / {ability.capitalGain || '-'}</h6>
        <h6>Morale: {ability.moraleCost|| '-'} / {ability.moraleDmg|| '-'} / {ability.moraleGain || '-'}</h6>
        <h6>Soul: {ability.soulCost || '-'} / {ability.soulDmg || '-'} / {ability.soulGain || '-'}</h6>
    </div>