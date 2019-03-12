import React, { Component } from 'react';
import './messages.component.css';

export default class Message extends Component {
    render() {
        const outgoing = this.props.message.outgoing;
        const offset = outgoing ? 'offset-l4 offset-m2' : '';
        const cardColor = outgoing ? 'blue lighten-1' : 'red lighten-1';
        const nickName = this.props.message.nickName;
        const nameChip = outgoing ? `To: ${nickName}` : `From: ${nickName}`;
        const body = this.props.message.body;
        const date = new Date(this.props.message.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;  

        return (
            <div className="row">
                <div className={`col l8 m10 s12 ${offset}`}>
                    <div className={`card-panel white-text ${cardColor}`}>
                        <div className="chip">{nameChip}</div>
                        <div className="chip">{this.props.message.key}</div>
                        <div className="chip">{formattedDate}</div>   
                        <br/>
                        {body}
                    </div>
                </div>
            </div>
        );
    }
}


