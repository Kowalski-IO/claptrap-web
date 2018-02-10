import * as mobx from 'mobx';

mobx.useStrict(true);

const defaultFilter = {
    "id" : "_default",
    "name" : "no filter",
    "contig" : {}
};

class StorageManager {
    constructor() {
        this.localStorage = window.localStorage;
        this.savedFilters = {
            "fancy.io" : [
                {
                    "id": "fancy.io:fancy_filter",
                    "environment" : "fancy.io",
                    "name": "fancy filter",
                    "config": {"condition":"OR","rules":[{"id":"subject","field":"subject","operator":"contains","value":"95"}],"valid":true}
                }
            ]
        };

        mobx.extendObservable(this, {
            selectedEnvironment: undefined,
            selectedFilter: undefined,
            selectedEmail: undefined,
            selectedViewerMode: undefined,

            emails: [],

            setSelectedEnvironment: mobx.action(function(environment) {
                this.selectedEnvironment = environment;
                this.selectedFilter = defaultFilter;
            }),

            setSelectedFilter: mobx.action(function(filter) {
                this.selectedFilter = filter;
                this.selectedEmail = undefined;
            }),

            setSelectedEmail: mobx.action(function(email) {
                this.selectedEmail = email;
                this.selectedViewerMode = 'PLAIN';
            }),

            setSelectedViewerMode: mobx.action(function(mode) {
               this.selectedViewerMode = mode;
            }),

            setEmails: mobx.action(function(emails) {
                this.emails = emails;
            }),

            removeEmail: mobx.action(function(email) {
                this.emails = this.emails.filter(item => item !== email);
            }),

            filtersForEnvironment: mobx.computed(function() {
                let filters = [];

                if (this.savedFilters[this.selectedEnvironment] != null) {
                    filters = filters.concat(this.savedFilters[this.selectedEnvironment]);
                }

                return filters;
            })
        });
    }

    storeValue(key, value) {
        this.localStorage.setItem(key, value);
    }

    retrieveValue(key) {
        return this.localStorage.getItem(key);
    }

    storeJSONValue(key, value) {
        let str = JSON.stringify(value);
        this.localStorage.setItem(key, str);
    }

    retrieveJSONValue(key) {
        let value = this.localStorage.getItem(key);
        return value && JSON.parse(value);
    }

}

export { StorageManager, defaultFilter };
