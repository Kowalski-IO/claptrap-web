import React, {Component} from 'react';
import {observer} from 'mobx-react';

import logo from '../../img/claptrap.svg';

const EmailViewer = observer(class EmailViewer extends Component {
    render() {
        return (
            <div className="col full-height">
                <div className="text-center full-height">
                    <img className="claptrap-logo align-middle" src={logo} alt="claptrap logo"/>
                </div>
            </div>
        )
    }
});

export default EmailViewer;
