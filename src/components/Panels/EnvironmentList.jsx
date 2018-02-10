import React, {Component} from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';

import Settings from '../../Settings';

const EnvironmentList = observer(class EnvironmentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            environments: []
        };
    }

    selectEnvironment = (environment) => {
        if (environment !== this.props.storage.selectedEnvironment) {
            this.props.storage.setSelectedEnvironment(environment);
            this.props.storage.setSelectedEmail(undefined);
        }
    };

    componentDidMount() {
        this.loadEnvironments();
    }

    loadEnvironments() {
        let apiEndpoint = Settings.getAPIRoot() + 'environments';
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    environments: json
                })
            });
    }

    buildToggleClassList(environment) {
        return classNames(
            'environment-square',
            'rounded',
            'mx-auto',
            {
                'environment-square-selected': this.props.storage.selectedEnvironment === environment
            }
        );
    }

    render() {
        const environments = this.state.environments.map((environment, i) =>
            <div key={environment} className={this.buildToggleClassList(environment)}
                 onClick={() => {
                     this.selectEnvironment(environment)
                 }}>
                <h1 data-toggle="tooltip" data-placement="bottom" data-offset="1"
                    title={environment}>
                    {environment.substr(0, 1).toUpperCase()}
                    {environment.substr(1, 1).toLowerCase()}
                </h1>
            </div>
        );

        return (
            <div className="col-sm-auto bg-primary full-height environment-list">
                {environments}
            </div>
        )
    }
});

export default EnvironmentList;
