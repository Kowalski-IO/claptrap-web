import React, {Component} from 'react';
import {observer} from 'mobx-react';
import moment from "moment/moment";

import Settings from '../../Settings';
import logo from '../../img/claptrap.svg';


const EmailViewer = observer(class EmailViewer extends Component {

    transformDate(emailDate) {
        let now = moment();
        let parsed = moment(emailDate);

        if (!now.isSame(emailDate, 'year')) {
            return parsed.format("dddd, MMM D, YYYY, h:mm A");
        }

        return parsed.format("dddd, MMM D, h:mm A");
    }

    contactFormatter(contact) {
        return contact.name != null
            ? <span title={contact.email}>{contact.name}</span>
            : <span>{contact.email}</span>;
    }

    renderURL(email, mode) {
        switch (mode) {
            case 'HTML':
                return Settings.getAPIRoot() + 'emails/' + email.id + '/html';
            case 'PLAIN':
            default:
                return Settings.getAPIRoot() + 'emails/' + email.id + '/plain';
        }
    }

    render() {
        let emailSelected = this.props.storage.selectedEmail !== undefined;

        let view;

        if (emailSelected) {
            let email = this.props.storage.selectedEmail;
            let header = email.header;

            let to;
            let cc;
            let bcc;

            let sender;
            let reply_to;

            let tos = header.to.map((contact) =>
                <li key={contact.email} className="list-inline-item">
                    {this.contactFormatter(contact)}</li>
            );

            let ccs = header.cc.map((contact) =>
                <li key={contact.email} className="list-inline-item">
                    {this.contactFormatter(contact)}</li>
            );

            let bccs = header.bcc.map((contact) =>
                <li key={contact.email} className="list-inline-item">
                    {this.contactFormatter(contact)}</li>
            );

            if (header.to.length > 0) {
                to =
                    <div className="clearfix">
                        <h6 className="d-inline text-muted">To: </h6>
                        <ul className="d-inline list-inline contacts">
                            {tos}
                        </ul>
                    </div>
            }

            if (header.cc.length > 0) {
                cc =
                    <div className="clearfix">
                        <h6 className="d-inline text-muted">Cc: </h6>
                        <ul className="d-inline list-inline contacts">
                            {ccs}
                        </ul>
                    </div>
            }

            if (header.bcc.length > 0) {
                bcc =
                    <div className="clearfix">
                        <h6 className="d-inline text-muted">Bcc: </h6>
                        <ul className="d-inline list-inline contacts">
                            {bccs}
                        </ul>
                    </div>
            }

            if (header.from.email !== header.sender.email) {
                sender =
                    <div className="clearfix">
                        <h6 className="d-inline text-muted">Sender: </h6>
                        <span className="d-inline">{this.contactFormatter(header.sender)}</span>
                    </div>
            }

            if (header.from.email !== header.replyTo.email) {
                reply_to =
                    <div className="clearfix">
                        <h6 className="d-inline text-muted">Reply To: </h6>
                        <span className="d-inline">{this.contactFormatter(header.replyTo)}</span>
                    </div>
            }

            let contacts =
                <div>
                    {to}
                    {cc}
                    {bcc}
                    {sender}
                    {reply_to}
                </div>;

            view =
                <div className="full-height">
                    <div className="row bg-dark">
                        <div className="col">
                            <h2 className="text-light">Email controls here</h2>
                        </div>
                    </div>
                    <div className="row bg-light pt-3">
                        <div className="col email-viewer-header">
                            <div className="clearfix">
                                <h5 className="float-left">{this.contactFormatter(header.from)}</h5>
                                <h6 className="float-right text-muted">{this.transformDate(email.received)}</h6>
                            </div>
                            {contacts}
                            <h5 className="pt-2">{header.subject}</h5>
                        </div>
                    </div>
                    <div className="row full-height">
                        <div className="col full-height">
                            <iframe title={header.subject} className="email-viewer-iframe" src={this.renderURL(email, 'PLAIN')} />
                        </div>
                    </div>
                </div>
        } else {
            view =
                <div className="text-center">
                    <img className="claptrap-logo" src={logo} alt="claptrap logo"/>
                </div>
        }

        return (
            <div className="col full-height">
                {view}
            </div>
        )
    }
});

export default EmailViewer;
