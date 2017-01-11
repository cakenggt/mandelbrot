import React from 'react';
import {connect} from 'react-redux';
import {startGifRender} from '../actionCreators/worker-actions';

var GifRenderSettings = React.createClass({
	propTypes: {
		zoomFrom: React.PropTypes.string,
		zoomSpeed: React.PropTypes.string,
		frameDelay: React.PropTypes.string,
		startGifRender: React.PropTypes.func,
		updateGifRenderSettings: React.PropTypes.func
	},
	render: function () {
		return (
			<div>
				<h2>GIF Settings</h2>
				<div>
					Zoom From
					<input
						onChange={this.handleZoomFromChange}
						value={this.props.zoomFrom}
						/>
				</div>
				<div>
					Zoom Speed
					<input
						onChange={this.handleZoomSpeedChange}
						value={this.props.zoomSpeed}
						/>
				</div>
				<div>
					Frame Delay
					<input
						onChange={this.handleFrameDelayChange}
						value={this.props.frameDelay}
						/>
				</div>
				<span
					onClick={this.handleRenderClick}
					className="btn"
					>Render</span>
			</div>
		);
	},
	handleZoomFromChange: function (e) {
		this.props.updateGifRenderSettings({
			zoomFrom: e.target.value
		});
	},
	handleZoomSpeedChange: function (e) {
		this.props.updateGifRenderSettings({
			zoomSpeed: e.target.value
		});
	},
	handleFrameDelayChange: function (e) {
		this.props.updateGifRenderSettings({
			frameDelay: e.target.value
		});
	},
	handleRenderClick: function () {
		this.props.startGifRender();
	}
});

var mapStateToProps = state => {
	return {
		zoomFrom: state.gifRenderSettings.zoomFrom,
		zoomSpeed: state.gifRenderSettings.zoomSpeed,
		frameDelay: state.gifRenderSettings.frameDelay
	};
};

var mapDispatchToProps = dispatch => {
	return {
		startGifRender: function () {
			dispatch(startGifRender());
		},
		updateGifRenderSettings: function (options) {
			dispatch({
				type: 'UPDATE_GIF_RENDER_SETTINGS',
				data: options
			});
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GifRenderSettings);
