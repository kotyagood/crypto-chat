import { crypto_box_SEEDBYTES, randombytes_buf, to_base64 } from 'libsodium-wrappers';
import React, { Component } from 'react';
import './join-form.component.css';
import M from 'materialize-css';

export default class JoinForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nickname: null,
            seed: null,
        };

        this.handleGenerateSeed = this.handleGenerateSeed.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        M.updateTextFields();
    }

    render() {
        return (
            <div className="JoinForm row">
                <div className="col l6 m8 s12 offset-l3 offset-m2">
                    <div className="card">
                        <div className="card-content">
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <span className="card-title">Join Crypto Chat</span>
                                    </div>
                                    <div className="input-field col s12">
                                        <input id="nickName-field" type="text" name="nickName" required onChange={this.handleInputChange} />
                                        <label >Nickname</label>
                                    </div>
                                    <div className="input-field col s8">
                                        <input id="seed-field" type="text" name="seed" value={this.state.seed} required onChange={this.handleInputChange} />
                                        <label htmlFor="seed-field" className={this.state.seed ? "active" : ""}>Key Seed</label>
                                    </div>
                                    <div className="input-field col s4" onClick={this.handleGenerateSeed}>
                                        <button type="button" className='waves-effect waves-light btn red'>
                                            Generate Seed
                                        </button>
                                    </div>
                                    <div className="input-field col s12">
                                        <button className='waves-effect waves-light btn red'>
                                            <i className="material-icons left">chat</i>Join Chat
                                    </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleGenerateSeed(event) {
        this.setState({
            seed: to_base64(randombytes_buf(crypto_box_SEEDBYTES)),
        });
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onJoin(this.state);
    }
}
