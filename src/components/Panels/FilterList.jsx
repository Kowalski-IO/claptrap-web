import React, {Component} from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';
import {defaultFilter} from '../../storage/StorageManager';

const FilterList = observer(class FilterList extends Component {

    buildToggleClassList(filter) {
        return classNames(
            'btn',
            'btn-md',
            'btn-info',
            'mb-3',
            'd-block',
            'mx-auto',
            {
                'active': this.props.storage.selectedFilter.id === filter.id
            }
        );
    }

    selectFilter(filter) {
        if (this.props.storage.selectedFilter.id !== filter.id) {
            this.props.storage.setSelectedFilter(filter)
        }
    }

    render() {
        let filterContainer;
        if (this.props.storage.selectedEnvironment == null) {
            filterContainer =
                <div className="text-center pt-4">
                    <h4 className="text-white">Select an<br />environment</h4>
                </div>
        } else {
            let filters = [];
            filters.push(defaultFilter);
            filters = filters.concat(this.props.storage.filtersForEnvironment);

            let filterToggles = filters.map((filter, i) =>
                <button key={filter['id']} onClick={() => {this.selectFilter(filter)}}
                        className={this.buildToggleClassList(filter)}>{filter.name}</button>
            );

            filterContainer =
                <div className="pt-4">
                    <button className="btn btn-md btn-primary mb-3 d-block mx-auto" data-toggle="modal" data-backdrop="static" data-target="#filterLibrary">filter library</button>
                    {filterToggles}
                </div>
        }

        return (
            <div className="col-sm-auto bg-dark full-height">
                {filterContainer}
            </div>
        )
    }
});

export default FilterList;
