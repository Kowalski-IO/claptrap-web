import * as mobx from 'mobx';

mobx.useStrict(true);

const defaultFilter = {
    "id" : "default",
    "name" : "no filter",
    "contig" : {}
}

class StorageManager {
    constructor() {
        this.localStorage = window.localStorage;
        this.savedFilters = {
            "kowalski.io" : [
                {
                    "id": "abc123",
                    "environment" : "kowalski.io",
                    "name": "fancy filter",
                    "config": {
                        "to": [
                            "brandon@kowalski.org"
                        ]
                    }
                }
            ]
        };

        mobx.extendObservable(this, {
            selectedEnvironment: undefined,
            selectedFilter: undefined,
            selectedEmail: undefined,

            setSelectedEnvironment: mobx.action(function(environment) {
                this.selectedEnvironment = environment;
                this.selectedFilter = defaultFilter;
            }),

            setSelectedFilter: mobx.action(function(filter) {
                this.selectedFilter = filter;
            }),

            setSelectedEmail: mobx.action(function(email) {
                this.selectedEmail = email;
            }),

            filtersForEnvironment: mobx.computed(function() {
                let filters = [];
                filters.push(defaultFilter);

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

export { StorageManager };
