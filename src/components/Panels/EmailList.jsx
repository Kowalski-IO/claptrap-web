import React, {Component} from 'react';
import {reaction} from 'mobx';
import {observer} from 'mobx-react';

import Truncate from 'react-truncate';
import moment from 'moment';
import Settings from "../../Settings";
import classNames from "classnames";

const EmailList = observer(class EmailList extends Component {

        constructor(props) {
            super(props);
            this.state = {
                emails: []
            };
        }

        componentDidMount() {
            reaction(
                () => [this.props.storage.selectedEnvironment, this.props.storage.selectedFilter],
                rx => this.loadEmails(rx[0], rx[1])
            )
        };

        loadEmails() {
            let apiEndpoint = Settings.getAPIRoot() + 'emails?environment='
                + this.props.storage.selectedEnvironment;

            this.setState({
                emails: []
            });

            fetch(apiEndpoint)
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        emails: json
                    })
                });
        }

        transformDate(emailDate) {
            let now = moment();
            let parsed = moment(emailDate);
            if (now.isSame(emailDate, 'day')) {
                return parsed.format("h:mm A");
            } else if (!now.isSame(emailDate, 'year')) {
                return parsed.format("MMM D, YYYY");
            } else {
                return parsed.format("MMM D");
            }
        }

        selectEmail(email) {
            if (email !== this.props.storage.selectedEmail) {
                this.props.storage.setSelectedEmail(email);
            }
        }

        buildEmailCardClassList(email) {
            return classNames(
                'card',
                'email-list-item',
                {
                    'email-list-item-selected': this.props.storage.selectedEmail !== undefined && this.props.storage.selectedEmail.id === email.id
                }
            );
        }

        render() {
            let emails = this.state.emails.map((email) =>
                <div key={email.id} className={this.buildEmailCardClassList(email)} onClick={() => {
                    this.selectEmail(email)
                }}>
                    <div className="card-body">
                        <div className="clearfix">
                            <h5 className="card-title float-left"
                                title={email.header.from.name ? email.header.from.email : null}>{email.header.from.name ? email.header.from.name : email.header.from.email}</h5>
                            <h6 className="card-subtitle float-right mt-1 text-muted">{this.transformDate(email.received)}</h6>
                        </div>
                        <h6 className="card-title mb-1">{email.header.subject}</h6>
                        <p className="card-text"><Truncate lines={2}>{email.body.plainText}</Truncate></p>
                    </div>
                </div>
            );

            return (
                <div
                    className="col-4 bg-light border border-dark border-top-0 border-bottom-0 border-left-0 full-height email-list">
                    {emails}
                </div>
            )
        }
    })
;
export default EmailList;
