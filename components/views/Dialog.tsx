import * as React from 'react'

interface Props {
    messages:Array<string>
    onStartTimer?:Function
}

export default class Dialog extends React.Component<Props> {

    state = { textLength: 0, currentStringIndex: 0 }

    componentDidMount(){
        this.renderNextLetter()
    }

    renderNextLetter = ()=> {
        if(this.state.textLength < this.props.messages[this.state.currentStringIndex].length){
            this.setState({textLength: this.state.textLength+1})
            setTimeout(this.renderNextLetter, 85)
        }
        else this.props.onStartTimer && this.props.onStartTimer()
    }

    render(){
        return <h3 dangerouslySetInnerHTML={{ __html: this.props.messages[this.state.currentStringIndex].substring(0,this.state.textLength)}}></h3>
    }
}
