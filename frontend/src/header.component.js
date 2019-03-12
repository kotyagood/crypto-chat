import React, { Component } from 'react';

export default class Header extends Component {
    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="#!" className="brand-logo">Crypto Chat</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="#!">{this.props.publicKey} ({this.props.nickName})</a></li>
                        <li><a href="#!"><i className="material-icons">help</i></a></li>
                        <li><a href="#!" onClick={this.props.onLeave}><i className="material-icons">logout</i></a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}
