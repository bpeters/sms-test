var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Main',
	propTypes: {
		params: React.PropTypes.object
	},
	render: function() {
		return (
			<div>
				{this.props.params}
			</div>
		);
	}
});
