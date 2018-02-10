import React, {Component} from 'react';
import {observer} from 'mobx-react';
import QueryBuilder from 'react-querybuilder';

const fields = [
    {name: 'firstName', label: 'First Name'},
    {name: 'lastName', label: 'Last Name'},
    {name: 'age', label: 'Age'},
    {name: 'address', label: 'Address'},
    {name: 'phone', label: 'Phone'},
    {name: 'email', label: 'Email'},
    {name: 'twitter', label: 'Twitter'},
    {name: 'isDev', label: 'Is a Developer?', value: false},
];

const queryBuilderClassnames = {
    ruleGroup: 'mt-3 mb-3 ml-3 pt-2 pb-2',
    combinators: 'form-control col-2 mb-3',

    addRule: 'btn btn-outline-primary',
    addGroup: 'btn btn-outline-info',
    removeGroup: 'btn btn-danger',
    removeRule: 'btn btn-danger',

    rule: 'form-inline mt-3 mb-3',
    fields: 'form-control col-4',
    operators: 'form-control col-4',
    value: 'form-control col-4'

};

const FilterLibrary = observer(class FilterLibrary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: "LIST"
        };
    }

    newFilter() {
        this.setState({
            mode: "EDIT"
        });
    }

    cancelEdit() {
        this.setState({
            mode: "LIST"
        });
    }

    logQuery(query) {
        console.log(query);
    }

    render() {
        let modalContent;

        let filters = this.props.storage.filtersForEnvironment;

        let filterTableItems = filters.map((filter, i) =>
            <tr key={filter.name}>
                <td>{filter.name}</td>
                <td>{filter.environment}</td>
                <td className="text-right">
                    <button className="btn btn-sm btn-outline-primary">edit</button>
                    <button className="btn btn-sm btn-outline-info">share</button>
                    <button className="btn btn-sm btn-outline-danger">delete</button>
                </td>
            </tr>
        );

        let filterTable =
            <table className="table table-striped">
                <thead className="thead-dark">
                <tr>
                    <th className="w-50">Filter Name</th>
                    <th>Environment</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {filterTableItems}
                </tbody>
            </table>;

        if (this.state.mode === 'LIST') {
            modalContent =
                <div>
                    <div className="modal-header">
                        <h3 className="modal-title">Filter Library</h3>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-primary" onClick={() => this.newFilter()}>
                                create
                            </button>
                            <button type="button" className="btn btn-link" data-dismiss="modal">
                                close
                            </button>
                        </div>
                    </div>
                    <div className="modal-body">
                        {filterTable}
                    </div>
                </div>
        } else {
            modalContent =
                <div>
                    <div className="modal-header">
                        <h3 className="modal-title">filter edit</h3>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <form>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="filterName" className="col-form-label">Recipient:</label>
                                            <input type="text" className="form-control" id="filterName"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="environment" className="col-form-label">Message:</label>
                                            <input type="text" className="form-control" id="environment"/>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <QueryBuilder fields={fields} controlClassnames={queryBuilderClassnames}
                                          onQueryChange={this.logQuery}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-danger"
                                onClick={() => this.cancelEdit()}>cancel
                        </button>
                        <button type="button" className="btn btn-primary">save</button>
                    </div>
                </div>
        }

        return (
            <div id="filterLibrary" className="modal fade" role="dialog" aria-labelledby="filterLibrary"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {modalContent}
                    </div>
                </div>
            </div>
        )
    }

});

export default FilterLibrary;
