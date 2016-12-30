import colorConvert from 'color-convert';
import {worker} from './actionCreators/worker-actions';

export default function (dispatch) {
	worker.onmessage = e => {
		if (typeof e.data === 'object') {
			var action = e.data;
			if (action.type === 'RENDER') {
				var canvas = document.getElementById('canvas');
				renderCanvas(canvas, action.data);
			} else {
				dispatch(e.data);
			}
		}
	};
}

function renderCanvas(canvas, data) {
	var renderedData = data.data;
	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(canvas.width, canvas.height);
	var current = 0;
	for (var y = 0; y < renderedData.length; y++) {
		var row = renderedData[y];
		for (var x = 0; x < row.length; x++) {
			var pixel = row[x];
			var rgb = [0, 0, 0];
			if (pixel < data.iterations) {
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
}
