import React from 'react';
import {connect} from 'react-redux';
import math from 'mathjs';
import {getPixelSize} from '../../mandelbrot-lib';

var RenderView = React.createClass({
	propTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		zoom: React.PropTypes.number,
		origin: React.PropTypes.string,
		navigate: React.PropTypes.func,
		objectURL: React.PropTypes.string
	},
	getInitialState: function () {
		return {
			mouseX: null,
			mouseY: null
		};
	},
	render: function () {
		var gif = this.props.objectURL ?
			(<div>
				<a href={this.props.objectURL} download="mandelbrot.gif">
					<img src={this.props.objectURL}/>
				</a>
			</div>) :
			null;
		var zoomFactor = 5;
		var zoomBox = this.state.mouseX === null ?
			null :
			(
				<div
					className="zoom-box"
					style={{
						left: this.state.mouseX - (this.props.width / (zoomFactor * 2)),
						top: this.state.mouseY - (this.props.height / (zoomFactor * 2)),
						width: this.props.width / zoomFactor,
						height: this.props.height / zoomFactor
					}}
					/>
			);
		return (
			<div
				className="render-view bordered"
				>
				<div>
					<div>
						{zoomBox}
						<canvas
							ref={this.bindCanvas}
							width={this.props.width}
							height={this.props.height}
							id="canvas"
							style={{
								width: this.props.width,
								height: this.props.height
							}}
							onClick={this.handleNavigationClick}
							onMouseMove={this.handleMouseMove}
							onMouseLeave={this.handleMouseLeave}
							/>
					</div>
					{gif}
				</div>
			</div>
		);
	},
	bindCanvas: function (c) {
		this.canvas = c;
	},
	handleNavigationClick: function (e) {
		var x = e.pageX - this.canvas.offsetLeft;
		var y = e.pageY - this.canvas.offsetTop;
		var diffX = x - (this.props.width / 2);
		var diffY = (this.props.height / 2) - y;
		var pixelSize = getPixelSize(this.props.width, this.props.zoom);
		var origin = math.complex(this.props.origin);
		var clickLoc = math.add(origin, math.complex(diffX * pixelSize, diffY * pixelSize));
		this.props.navigate({
			origin: clickLoc.toString()
		});
	},
	handleMouseMove: function (e) {
		this.setState({
			mouseX: e.pageX,
			mouseY: e.pageY
		});
	},
	handleMouseLeave: function () {
		this.setState({mouseX: null, mouseY: null});
	}
});

var mapStateToProps = state => {
	return {
		width: state.worker.width,
		height: state.worker.height,
		zoom: state.worker.zoom,
		origin: state.worker.origin,
		objectURL: state.gifRenderSettings.objectURL
	};
};

var mapDispatchToProps = dispatch => {
	return {
		navigate: function (options) {
			dispatch({
				type: 'NAVIGATE',
				data: options
			});
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RenderView);
