import React from 'react';
import {connect} from 'react-redux';
import {startRender} from '../actionCreators/worker-actions';

var RenderSettings = React.createClass({
	propTypes: {
		origin: React.PropTypes.string,
		zoom: React.PropTypes.string,
		updateRenderSettings: React.PropTypes.func,
		startRender: React.PropTypes.func,
		width: React.PropTypes.string,
		height: React.PropTypes.string,
		iterations: React.PropTypes.string,
		escape: React.PropTypes.string,
		equation: React.PropTypes.string
	},
	render: function () {
		return (
			<div
				className="render-settings"
				>
				<h2>Render Settings</h2>
				<div>
					Origin
					<input
						onChange={this.handleOriginChange}
						value={this.props.origin}
						/>
				</div>
				<div>
					Zoom
					<input
						onChange={this.handleZoomChange}
						value={this.props.zoom}
						/>
				</div>
				<div>
					Width
					<input
						onChange={this.handleWidthChange}
						value={this.props.width}
						/>
				</div>
				<div>
					Height
					<input
						onChange={this.handleHeightChange}
						value={this.props.height}
						/>
				</div>
				<div>
					Iterations
					<input
						onChange={this.handleIterationsChange}
						value={this.props.iterations}
						/>
				</div>
				<div>
					Escape
					<input
						onChange={this.handleEscapeChange}
						value={this.props.escape}
						/>
				</div>
				<div>
					Equation
					<input
						onChange={this.handleEquationChange}
						value={this.props.equation}
						/>
				</div>
				<span
					onClick={this.handleRenderClick}
					>Render</span>
			</div>
		);
	},
	handleOriginChange: function (e) {
		this.props.updateRenderSettings({
			origin: e.target.value
		});
	},
	handleZoomChange: function (e) {
		this.props.updateRenderSettings({
			zoom: e.target.value
		});
	},
	handleWidthChange: function (e) {
		this.props.updateRenderSettings({
			width: e.target.value
		});
	},
	handleHeightChange: function (e) {
		this.props.updateRenderSettings({
			height: e.target.value
		});
	},
	handleIterationsChange: function (e) {
		this.props.updateRenderSettings({
			iterations: e.target.value
		});
	},
	handleEscapeChange: function (e) {
		this.props.updateRenderSettings({
			escape: e.target.value
		});
	},
	handleEquationChange: function (e) {
		this.props.updateRenderSettings({
			equation: e.target.value
		});
	},
	handleRenderClick: function () {
		this.props.startRender();
	}
});

var mapStateToProps = state => {
	return {
		origin: state.renderSettings.origin,
		zoom: state.renderSettings.zoom,
		width: state.renderSettings.width,
		height: state.renderSettings.height,
		iterations: state.renderSettings.iterations,
		escape: state.renderSettings.escape,
		equation: state.renderSettings.equation
	};
};

var mapDispatchToProps = dispatch => {
	return {
		startRender: function () {
			dispatch(startRender());
		},
		updateRenderSettings: function (options) {
			dispatch({
				type: 'UPDATE_RENDER_SETTINGS',
				data: options
			});
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RenderSettings);
