import React from 'react';
import {connect} from 'react-redux';
import {startRender} from '../actionCreators/worker-actions';

var NavigationView = React.createClass({
	propTypes: {
		origin: React.PropTypes.string,
		zoom: React.PropTypes.string,
		updateRenderSettings: React.PropTypes.func,
		startRender: React.PropTypes.func
	},
	render: function () {
		return (
			<div>
				<h2>Navigation</h2>
				<div>
					Your clicked origin is:
				</div>
				<div>
					{this.props.origin}
				</div>
				<span
					onClick={this.handleSetOriginClick}
					className="btn"
					>
					Set origin
				</span>
				<div>
					<span className="btn" onClick={this.handleZoomInClick}>Zoom in</span>
					<span className="btn" onClick={this.handleZoomOutClick}>Zoom out</span>
				</div>
			</div>
		);
	},
	handleSetOriginClick: function () {
		this.props.updateRenderSettings({
			origin: this.props.origin
		});
	},
	handleZoomInClick: function () {
		this.props.updateRenderSettings({
			zoom: (this.props.zoom * 5).toString()
		});
		this.props.startRender();
	},
	handleZoomOutClick: function () {
		this.props.updateRenderSettings({
			zoom: (this.props.zoom * (1 / 5)).toString()
		});
		this.props.startRender();
	}
});

var mapStateToProps = state => {
	return {
		origin: state.navigation.origin,
		zoom: state.renderSettings.zoom
	};
};

var mapDispatchToProps = dispatch => {
	return {
		updateRenderSettings: function (options) {
			dispatch({
				type: 'UPDATE_RENDER_SETTINGS',
				data: options
			});
		},
		startRender: function () {
			dispatch(startRender());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavigationView);
