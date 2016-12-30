import React from 'react';
import {connect} from 'react-redux';
import colorConvert from 'color-convert';
import math from 'mathjs';
import {getPixelSize} from '../../mandelbrot-lib';

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
		var imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
		var current = 0;
		for (var y = 0; y < renderedData.length; y++) {
			var row = renderedData[y];
			for (var x = 0; x < row.length; x++) {
				var pixel = row[x];
				var rgb = [0, 0, 0];
				if (pixel < this.props.iterations) {
					var huePercent = pixel;
					while (huePercent > 1) {
						huePercent /= 10;
					}
					rgb = colorConvert.hsl.rgb(Math.floor(huePercent * 359), 100, 50);
				}
				imageData.data[current * 4] = rgb[0];
				imageData.data[(current * 4) + 1] = rgb[1];
				imageData.data[(current * 4) + 2] = rgb[2];
				imageData.data[(current * 4) + 3] = 255;
				current++;
			}
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
