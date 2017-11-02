import React, {Component} from 'react';

import {StorageManager} from './storage/StorageManager';

import EnvironmentList from './components/Panels/EnvironmentList';
import FilterList from './components/Panels/FilterList';
import EmailList from './components/Panels/EmailList';
import EmailViewer from './components/Panels/EmailViewer';

import './styles/bootstap-4-custom.css';
import './App.css';

const store = new StorageManager();

class App extends Component {
    render() {
        return (
            <div className="container-fluid full-height">
                <div className="row full-height">

                    <EnvironmentList storage={store}/>
                    <FilterList storage={store}/>
                    <EmailList storage={store}/>
                    <EmailViewer storage={store}/>

                </div>
            </div>
        );
    }
}

export default App;
