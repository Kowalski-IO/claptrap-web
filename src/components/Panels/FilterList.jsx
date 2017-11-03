import React, {Component} from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';

const FilterList = observer(class FilterList extends Component {

    buildToggleClassList(filter) {
        return classNames(
            'btn',
            'btn-md',
            'btn-outline-info',
            'mb-3',
            'd-block',
            'mx-auto',
            {
                'active': this.props.storage.selectedFilter.id === filter.id
            }
        );
    }

    render() {
        let filterContainer;
        if (this.props.storage.selectedEnvironment == null) {
            filterContainer =
                <div className="text-center pt-4">
                    <h3 className="text-white">Select an environment</h3>
                </div>
        } else {
            let filters = this.props.storage.filtersForEnvironment;

            let filterToggles = filters.map((filter, i) =>
                <button key={filter['id']} onClick={() => {this.props.storage.setSelectedFilter(filter)}}
                        className={this.buildToggleClassList(filter)}>{filter.name}</button>
            )

            filterContainer =
                <div className="pt-4">
                    <button className="btn btn-lg btn-primary mb-3 d-block mx-auto">create filter</button>
                    {filterToggles}
                </div>
        }

        return (
            <div className="col-2 bg-dark full-height">
                {filterContainer}
            </div>
        )
    }
});

export default FilterList;
