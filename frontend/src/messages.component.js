import React, { Component } from 'react';
import Message from './message.component';
import './messages.component.css';

export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentDidUpdate() {
        this.scrollDown();
    }

    scrollDown() {
        this.containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    render() {
        return (
            <div className="Messages container" ref={this.containerRef}>
                {this.props.messages.map((message, idx) => (<Message key={idx} message={message} />))}
            </div>
        );
    }
}


