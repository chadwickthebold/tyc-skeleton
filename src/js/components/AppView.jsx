import React from 'react';
import ListenersMixin from '../util/listeners-mixin';

export default React.createClass({
    mixins: [ListenersMixin],

    getListeners: function () {
        return [{
          model: this.props.app,
          events: {change: this.forceUpdate.bind(this, null)}
        }];
    },

    componentWillMount: function () {
        //this.props.app.fetch();
    },

    render: function () {
        return (
            <span className="appview">
                {this.props.app.get("message")}
            </span>
        );
    }
});