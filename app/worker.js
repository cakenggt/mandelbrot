import math from 'mathjs';
import {calculateEscape} from '../mandelbrot-lib';

math.config({number: 'BigNumber', precision: 64});

onmessage = function (e) { // eslint-disable-line no-undef
	// e.data contains the object posted
	var data = e.data;
	var workerResult = genericRender(data);
	postMessage({
		type: 'RENDER',
		data: workerResult
	});
};

function genericRender(options) {
	// zoom is how many units can fit in the width
	options.zoom = math.bignumber(options.zoom);
	options.origin = math.complex(options.origin);
	options.width = math.bignumber(options.width);
	options.height = math.bignumber(options.height);
	var expression = math.compile(options.equation);
	// iterations that it takes to escape are recorded in the result
	var result = [];
	var pixelSize = math.chain(1).divide(options.zoom).divide(options.width).done();
	for (let yi = 0; yi < options.height; yi++) {
		postMessage({
			type: 'PROGRESS',
			data: math.divide(yi + 1, options.height).toNumber()
		});
		let y = math.chain(math.bignumber(options.origin.im)).add(math.chain(pixelSize).multiply(options.height).divide(2).done()).subtract(math.chain(pixelSize).multiply(yi).done()).done();
		let row = [];
		for (let xi = 0; xi < options.width; xi++) {
			let x = math.chain(math.bignumber(options.origin.re)).subtract(math.chain(pixelSize).multiply(options.width).divide(2).done()).add(math.chain(pixelSize).multiply(xi).done()).done();
			let c = math.complex(x, y);
			let Z = c;
			row.push(calculateEscape({
				c: c,
				Z: Z,
				expression: expression,
				escape: options.escape,
				iterations: options.iterations
			}));
		}
		result.push(row);
	}
	return {
		iterations: options.iterations,
		renderedData: result,
		timestamp: new Date().getTime()
	};
}
