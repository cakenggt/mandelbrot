import math from 'mathjs';
import {calculateEscape, getPixelSize} from '../mandelbrot-lib';

math.config({number: 'BigNumber', precision: 64});

onmessage = function (e) { // eslint-disable-line no-undef
	// e.data contains the object posted
	var action = e.data;
	var options = action.data;
	var workerResult;
	if (action.type === 'SINGLE_FRAME_RENDER') {
		options.progressFunction = progress => progress;
		workerResult = genericRender(options);
		sanitizeMessage(workerResult);
		postMessage({
			type: 'SINGLE_FRAME_RENDER',
			data: workerResult
		});
	} else if (action.type === 'GIF_RENDER') {
		var startZoom = action.data.zoomFrom;
		var endZoom = action.data.zoomTo;
		var speed = action.data.speed + 1;
		var totalFrames = Math.ceil(Math.log(endZoom / startZoom) / Math.log(speed));
		var currentFrame = 0;
		options.progressFunction = progress => {
			return (currentFrame / totalFrames) + (progress * (1 / totalFrames));
		};
		for (let zoom = startZoom; zoom <= endZoom; zoom *= speed) {
			options.zoom = zoom;
			var data = genericRender(options);
			sanitizeMessage(data);
			postMessage({
				type: 'GIF_RENDER',
				data: data
			});
			currentFrame++;
		}
		postMessage({
			type: 'GIF_END'
		});
	}
};

/*
 * Removes all functions from an object
 */
function sanitizeMessage(data) {
	var keys = Object.keys(data);
	for (var k = 0; k < keys.length; k++) {
		var key = keys[k];
		if (data[key] instanceof Function) {
			delete data[key];
		}
	}
}

function genericRender(options) {
	// zoom is how many units can fit in the width
	var convertedOptions = Object.assign({}, options, {
		zoom: math.bignumber(options.zoom),
		origin: math.complex(options.origin),
		width: math.bignumber(options.width),
		height: math.bignumber(options.height)
	});
	var expression = math.compile(convertedOptions.equation);
	// iterations that it takes to escape are recorded in the result
	var result = [];
	var pixelSize = getPixelSize(convertedOptions.zoom, convertedOptions.width);
	for (let yi = 0; yi < convertedOptions.height; yi++) {
		postMessage({
			type: 'PROGRESS',
			data: options.progressFunction(
				math.divide(yi + 1, convertedOptions.height).toNumber()
			)
		});
		let y = math.chain(math.bignumber(convertedOptions.origin.im)).add(math.chain(pixelSize).multiply(convertedOptions.height).divide(2).done()).subtract(math.chain(pixelSize).multiply(yi).done()).done();
		let row = [];
		for (let xi = 0; xi < convertedOptions.width; xi++) {
			let x = math.chain(math.bignumber(convertedOptions.origin.re)).subtract(math.chain(pixelSize).multiply(convertedOptions.width).divide(2).done()).add(math.chain(pixelSize).multiply(xi).done()).done();
			let c = math.complex(x, y);
			let Z = c;
			row.push(calculateEscape({
				c: c,
				Z: Z,
				expression: expression,
				escape: convertedOptions.escape,
				iterations: convertedOptions.iterations
			}));
		}
		result.push(row);
	}
	return Object.assign({}, options, {
		renderedData: result,
		timestamp: new Date().getTime()
	});
}
