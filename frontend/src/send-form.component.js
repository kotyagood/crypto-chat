import React, { Component } from 'react';
import M from 'materialize-css';
import './send-form.component.css';

export default class SendForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            recepient: null,
            body: null,
        };

        this.recepientInputRef = React.createRef();
        this.bodyInputRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log('----> 1');
        M.updateTextFields();
        M.FormSelect.init(this.recepientInputRef.current, {});
    }

    componentDidUpdate() {
        console.log('----> 2');
        M.FormSelect.init(this.recepientInputRef.current, {});
    }

    render() {
        return (
            <div className="SendForm red lighten-2">
                <form className="container" onSubmit={this.handleSubmit}>
                    <div className="row card-panel white">
                        <div className="input-field col l3 m4 s12">
                            <select id='recepient-input' name='recepient' defaultValue="" required onChange={this.handleInputChange} ref={this.recepientInputRef}>
                                <option value="" disabled>Choose recepient</option>
                                {this.props.roster.map((recepient) => <option key={recepient.key} value={recepient.key}>{recepient.nickName}</option>)}
                            </select>
                            <label htmlFor='recepient-input'>Recepient</label>
                        </div>
                        <div className="input-field col l8 m6 s9">
                            <input id="body-input" name="body" type="text" required onChange={this.handleInputChange} ref={this.bodyInputRef} />
                            <label htmlFor="body-input">Message</label>
                        </div>
                        <div className="input-field col l1 m2 s3">
                            <button className='waves-effect waves-light btn red'>
                                <i className="material-icons left">send</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div >
        );
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.bodyInputRef.current.value = '';
        this.props.onSend(this.state);
    }
}
