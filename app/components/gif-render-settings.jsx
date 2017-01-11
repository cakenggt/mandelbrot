import React from 'react';
import {connect} from 'react-redux';
import {startGifRender} from '../actionCreators/worker-actions';

var GifRenderSettings = React.createClass({
	propTypes: {
		zoomFrom: React.PropTypes.string,
		speed: React.PropTypes.string,
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
					Speed
					<input
						onChange={this.handleSpeedChange}
						value={this.props.speed}
						/>
				</div>
				<span
					onClick={this.handleRenderClick}
					>Render</span>
			</div>
		);
	},
	handleZoomFromChange: function (e) {
		this.props.updateGifRenderSettings({
			zoomFrom: e.target.value
		});
	},
	handleSpeedChange: function (e) {
		this.props.updateGifRenderSettings({
			speed: e.target.value
		});
	},
	handleRenderClick: function () {
		this.props.startGifRender();
	}
});

var mapStateToProps = state => {
	return {
		zoomFrom: state.gifRenderSettings.zoomFrom,
		speed: state.gifRenderSettings.speed
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
