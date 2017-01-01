var math = require('mathjs');
var colorConvert = require('color-convert');

exports.calculateEscape = function (options) {
	// options.expression must be a compiled math.js expression
	let iterToEscape = 0;
	let c = options.c;
	let Z = options.Z;
	for (let i = 0; i < options.iterations; i++) {
		Z = options.expression.eval({
			Z: Z,
			c: c
		});
		if (math.abs(Z.re) >= options.escape || math.abs(Z.im) >= options.escape) {
			break;
		}
		iterToEscape++;
	}
	return iterToEscape;
};

exports.getPixelSize = function (width, zoom) {
	return math.chain(1).divide(zoom).divide(width).done();
};

exports.convertIterationsToRGBA = function (renderedData, iterations) {
	var result = [];
	for (var y = 0; y < renderedData.length; y++) {
		var row = renderedData[y];
		for (var x = 0; x < row.length; x++) {
			var pixel = row[x];
			var rgb = [0, 0, 0];
			if (pixel < iterations) {
				var huePercent = pixel;
				while (huePercent > 1) {
					huePercent /= 10;
				}
				rgb = colorConvert.hsl.rgb(Math.floor(huePercent * 359), 100, 50);
			}
			result.push(rgb[0]);
			result.push(rgb[1]);
			result.push(rgb[2]);
			result.push(255);
		}
	}
	return result;
};
