import React, {Component} from 'react';
import {observer} from 'mobx-react';
import moment from 'moment/moment';

import Settings from '../../Settings';
import classNames from "classnames";

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

    viewerButtonClassList(mode) {
        return classNames(
            'btn',
            'btn-lg',
            'btn-info',
            {
                'active': this.props.storage.selectedViewerMode === mode,
                'd-none': this.determineVisibilty(mode)
            }
        );
    }

    determineVisibilty(mode) {
        switch (mode) {
            case 'PLAIN':
                return this.props.storage.selectedEmail.body.html == null
                    && this.props.storage.selectedEmail.body.attachments.length === 0;
            case 'HTML':
                return this.props.storage.selectedEmail.body.html == null;
            case 'ATTACHMENT':
                return this.props.storage.selectedEmail.body.attachments.length === 0;
            default:
                return false;
        }
    }

    delete(email) {
        let apiEndpoint = Settings.getAPIRoot() + 'emails/' + email.id;
        fetch(apiEndpoint, {
            method: 'delete'
        }).then(() => {
                this.props.storage.setSelectedEmail(undefined);
                this.props.storage.removeEmail(email);
            }
        );
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
                        <h6 className="d-inline">To: </h6>
                        <ul className="d-inline list-inline contacts">
                            {tos}
                        </ul>
                    </div>
            }

            if (header.cc.length > 0) {
                cc =
                    <div className="clearfix">
                        <h6 className="d-inline">Cc: </h6>
                        <ul className="d-inline list-inline contacts">
                            {ccs}
                        </ul>
                    </div>
            }

            if (header.bcc.length > 0) {
                bcc =
                    <div className="clearfix">
                        <h6 className="d-inline">Bcc: </h6>
                        <ul className="d-inline list-inline contacts">
                            {bccs}
                        </ul>
                    </div>
            }

            if (header.from.email !== header.sender.email) {
                sender =
                    <div className="clearfix">
                        <h6 className="d-inline">Sender: </h6>
                        <span className="d-inline">{this.contactFormatter(header.sender)}</span>
                    </div>
            }

            if (header.from.email !== header.replyTo.email) {
                reply_to =
                    <div className="clearfix">
                        <h6 className="d-inline">Reply To: </h6>
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

            let viewerInner;

            if (this.props.storage.selectedViewerMode === 'ATTACHMENT') {
                let attachments =
                    email.body.attachments.map((attachment, i) =>
                        <tr key={attachment.id}>
                            <th scope="row">{i + 1}</th>
                            <td>{attachment.filename}</td>
                            <td>{attachment.contentType}</td>
                            <td><a download={attachment.filename} className="btn btn-outline-primary"
                                   href={"//localhost:8585/api/attachments/" + email.id + "/" + attachment.id}>Download</a></td>
                        </tr>
                    );

                viewerInner =
                    <table className="table mt-2">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Filename</th>
                            <th scope="col">Content-Type</th>
                            <th scope="col">Download</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attachments}
                        </tbody>
                    </table>
            } else {
                viewerInner =
                    <iframe title={header.subject} className="email-viewer-iframe"
                            src={this.renderURL(email, this.props.storage.selectedViewerMode)}/>;
            }

            view =
                <div className="full-height">
                    <div className="row bg-dark">
                        <div className="col pl-0 pr-0">
                            <div className="float-left">
                                <button className={this.viewerButtonClassList('PLAIN')} onClick={() => {
                                    this.props.storage.setSelectedViewerMode('PLAIN')
                                }}>Plain Body
                                </button>
                                <button className={this.viewerButtonClassList('HTML')} onClick={() => {
                                    this.props.storage.setSelectedViewerMode('HTML')
                                }}>HTML Body
                                </button>
                                <button className={this.viewerButtonClassList('ATTACHMENT')} onClick={() => {
                                    this.props.storage.setSelectedViewerMode('ATTACHMENT')
                                }}>Attachments
                                </button>
                            </div>
                            <div className="float-right">
                                <button className="btn btn-lg btn-info">Send Externally</button>
                                <button className="btn btn-lg btn-info" onClick={() => {
                                    this.delete(email)
                                }}>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row bg-light pt-3">
                        <div className="col email-viewer-header">
                            <div className="clearfix">
                                <h3 className="float-left">{this.contactFormatter(header.from)}</h3>
                                <h6 className="float-right">{this.transformDate(email.received)}</h6>
                            </div>
                            {contacts}
                            <h4 className="pt-2">{header.subject}</h4>
                        </div>
                    </div>
                    <div className="row full-height">
                        <div className="col full-height">
                            {viewerInner}
                        </div>
                    </div>
                </div>
        } else {
            view =
                <div className="text-center">

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
