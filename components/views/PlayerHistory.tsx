import * as React from 'react'
import Tooltip from 'rc-tooltip'

interface Props {
    history: Array<BuildHistory>
}

export default (props:Props) => 
    <div>
        {props.history.map((h,i)=>
            <div>
                <h5>Round {i}</h5>
                {h.abilities.map((a,i)=>
                <Tooltip overlay={<AbilityTooltip ability={a}/>}>
                    <div>{i} - {a.name}</div>
                </Tooltip>
                )}
            </div>
        )}
    </div>
        
interface TipProps {
    ability:Ability
}

export const AbilityTooltip = ({ability}:TipProps) => 
    <div>
        <h5>{ability.name}</h5>
        <h6>{ability.description}</h6>
        <h6>Capital: {ability.capitalCost|| '-'} / {ability.capitalDmg|| '-'}</h6>
        <h6>Morale: {ability.moraleCost|| '-'} / {ability.moraleDmg|| '-'}</h6>
        <h6>Soul: {ability.soulCost || '-'} / {ability.soulDmg || '-'}</h6>
        {ability.special && <h6>Special: {ability.special}</h6>}
    </div>