var math = require('mathjs');

exports.calculateEscape = function(options) {
	let iterToEscape = 0;
	let c = options.c;
	let Z = options.Z;
	for (let i = 0; i < options.iterations; i++){
		Z = options.expression.eval({
			Z: Z,
			c: c
		});
		if (math.abs(Z.re)>=options.escape || math.abs(Z.im)>=options.escape){
			break;
		}
		iterToEscape++;
	}
	return iterToEscape;
}
