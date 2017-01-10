import GIF from 'gif.js';
import {convertIterationsToRGBA} from '../mandelbrot-lib';
import {worker} from './actionCreators/worker-actions';

export default function (dispatch, getState) {
	worker.onmessage = e => {
		if (typeof e.data === 'object') {
			var action = e.data;
			var gif = getState().gifRenderSettings.gif;
			if (action.type === 'GIF_RENDER') {
				gif = gif || new GIF({
					workers: 2,
					quality: 10,
					workerScript: 'js/gif.worker.js'
				});
				var imageData = renderData(action.data);
				gif.addFrame(imageData, {delay: 16});
				dispatch({
					type: 'UPDATE_GIF_RENDER_SETTINGS',
					data: {
						gif: gif
					}
				});
			} else if (action.type === 'GIF_END') {
				gif.on('finished', blob => {
					var reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = function () {
						dispatch({
							type: 'UPDATE_GIF_RENDER_SETTINGS',
							data: {
								datauri: reader.result
							}
						});
					};
				});
				gif.render();
				dispatch({
					type: 'UPDATE_GIF_RENDER_SETTINGS',
					data: {
						gif: null
					}
				});
			} else if (action.type === 'SINGLE_FRAME_RENDER') {
				dispatch({
					type: 'UPDATE_WORKER_STATE',
					data: action.data
				});
				renderData(action.data);
			} else {
				dispatch(action);
			}
		}
	};
}

function renderData(data) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var renderedData = data.renderedData;
	var rgbaData = convertIterationsToRGBA(renderedData, data.iterations);
	var imageData = ctx.createImageData(canvas.width, canvas.height);
	for (var i = 0; i < rgbaData.length; i++) {
		imageData.data[i] = rgbaData[i];
	}
	ctx.putImageData(imageData, 0, 0);
	return imageData;
}
