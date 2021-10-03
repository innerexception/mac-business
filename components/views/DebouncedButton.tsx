import * as React from 'react'
import { Button } from '../Shared'

interface Props {
    text: string
    disabledText: string
    onClick: Function
    disabled?:boolean
    style?: object
}

interface State {
    isLoading:boolean
}

export default class DebouncedButton extends React.Component<Props, State> {
    state:State = { isLoading: false }

    debounce = async () => {
        this.setState({isLoading: true})
        await this.props.onClick()
        this.setState({isLoading: false})
    }

    render(){
        return Button(!this.state.isLoading, this.debounce, this.state.isLoading ? this.props.disabledText : this.props.text)
    }
}