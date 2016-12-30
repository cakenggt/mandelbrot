var math = require('mathjs');
import {calculateEscape} from '../mandelbrot-lib';

math.config({ number: 'BigNumber', precision: 64 });

onmessage = function(e) {
	//e.data contains the object posted
	var data = e.data;
  var workerResult = genericRender(data);
  postMessage({
		type: 'RENDER',
		data: workerResult
	});
}

function mandelbrotRender(options){
	//zoom is how many units can fit in the width
	options = Object.assign({}, {
		zoom: 8,
		origin: '-1.74999841099374081749002483162428393452822172335808534616943930976364725846655540417646727085571962736578151132907961927190726789896685696750162524460775546580822744596887978637416593715319388030232414667046419863755743802804780843375-0.00000000000000165712469295418692325810961981279189026504290127375760405334498110850956047368308707050735960323397389547038231194872482690340369921750514146922400928554011996123112902000856666847088788158433995358406779259404221904755i',
		width: 800,
		height: 600,
		iterations: 100,
		escape: 2
	}, options);
	options.zoom = math.bignumber(options.zoom);
	options.origin = math.complex(options.origin);
	options.width = math.bignumber(options.width);
	options.height = math.bignumber(options.height);
	//iterations that it takes to escape are recorded in the result
	var result = [];
	var pixelSize = math.chain(options.zoom).divide(options.width).done();
	for (let yi = 0; yi < options.height; yi++){
		postMessage({
			type: 'PROGRESS',
			data: math.divide(yi+1, options.height).toNumber()
		});
		let y = math.chain(math.bignumber(options.origin.im)).add(math.chain(pixelSize).multiply(options.height).divide(2).done()).subtract(math.chain(pixelSize).multiply(yi).done()).done();
		let row = [];
		for (let xi = 0; xi < options.width; xi++){
			let x = math.chain(math.bignumber(options.origin.re)).subtract(math.chain(pixelSize).multiply(options.width).divide(2).done()).add(math.chain(pixelSize).multiply(xi).done()).done();
			let iterToEscape = 0;
			let c = math.complex(x, y);
			let Z = c;
			for (let i = 0; i < options.iterations; i++){
				Z = math.chain(Z).pow(2).add(c).done();
				if (Z.abs()>=options.escape){
					break;
				}
				iterToEscape++;
			}
			row.push(iterToEscape);
		}
		result.push(row);
	}
	return {
		iterations: options.iterations,
		data: result
	};
}

function genericRender(options){
	//zoom is how many units can fit in the width
	options = Object.assign({}, {
		zoom: 1,
		origin: '-1.74999841099374081749002483162428393452822172335808534616943930976364725846655540417646727085571962736578151132907961927190726789896685696750162524460775546580822744596887978637416593715319388030232414667046419863755743802804780843375-0.00000000000000165712469295418692325810961981279189026504290127375760405334498110850956047368308707050735960323397389547038231194872482690340369921750514146922400928554011996123112902000856666847088788158433995358406779259404221904755i',
		width: 400,
		height: 300,
		iterations: 100,
		escape: 2,
		equation: 'Z^2+c'
	}, options);
	options.zoom = math.bignumber(options.zoom);
	options.origin = math.complex(options.origin);
	options.width = math.bignumber(options.width);
	options.height = math.bignumber(options.height);
	var expression = math.compile(options.equation);
	//iterations that it takes to escape are recorded in the result
	var result = [];
	var pixelSize = math.chain(1).divide(options.zoom).divide(options.width).done();
	for (let yi = 0; yi < options.height; yi++){
		postMessage({
			type: 'PROGRESS',
			data: math.divide(yi+1, options.height).toNumber()
		});
		let y = math.chain(math.bignumber(options.origin.im)).add(math.chain(pixelSize).multiply(options.height).divide(2).done()).subtract(math.chain(pixelSize).multiply(yi).done()).done();
		let row = [];
		for (let xi = 0; xi < options.width; xi++){
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
		data: result
	};
}
