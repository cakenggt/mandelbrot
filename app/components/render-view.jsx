import React from 'react';
import {connect} from 'react-redux';
import math from 'mathjs';
import {getPixelSize, convertIterationsToRGBA} from '../../mandelbrot-lib';

var RenderView = React.createClass({
	shouldComponentUpdate: function (nextProps) {
		return this.props.timestamp !== nextProps.timestamp;
	},
	propTypes: {
		timestamp: React.PropTypes.number,
		renderedData: React.PropTypes.array,
		iterations: React.PropTypes.number,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		zoom: React.PropTypes.number,
		origin: React.PropTypes.string,
		navigate: React.PropTypes.func
	},
	render: function () {
		if (this.canvas) {
			var ctx = this.canvas.getContext('2d');
			this.renderCanvas(ctx);
		}
		return (
			<canvas
				ref={this.bindCanvas}
				width={this.props.width}
				height={this.props.height}
				onClick={this.handleNavigationClick}
				/>
		);
	},
	bindCanvas: function (c) {
		this.canvas = c;
	},
	renderCanvas: function (ctx) {
		var renderedData = this.props.renderedData;
		var rgbaData = convertIterationsToRGBA(renderedData, this.props.iterations);
		var imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
		for (var i = 0; i < rgbaData.length; i++) {
			imageData.data[i] = rgbaData[i];
		}
		ctx.putImageData(imageData, 0, 0);
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
	}
});

var mapStateToProps = state => {
	return {
		renderedData: state.worker.renderedData,
		timestamp: state.worker.timestamp,
		iterations: state.worker.iterations,
		width: state.worker.width,
		height: state.worker.height,
		zoom: state.worker.zoom,
		origin: state.worker.origin
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
