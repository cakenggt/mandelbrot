import React from 'react';
import {connect} from 'react-redux';
import {startRender} from '../actionCreators/worker-actions';

var NavigationView = React.createClass({
	propTypes: {
		renderOrigin: React.PropTypes.string,
		origin: React.PropTypes.string,
		zoom: React.PropTypes.string,
		updateRenderSettings: React.PropTypes.func,
		startRender: React.PropTypes.func
	},
	render: function () {
		var setOriginHandler = this.props.origin === this.props.renderOrigin ?
			null :
			this.handleSetOriginClick;
		var setOriginClass = this.props.origin === this.props.renderOrigin ?
			'btn inactive' :
			'btn';
		return (
			<div>
				<h2>Navigation</h2>
				<span
					onClick={setOriginHandler}
					className={setOriginClass}
					>
					Set clicked origin
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
		zoom: state.renderSettings.zoom,
		renderOrigin: state.renderSettings.origin
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
