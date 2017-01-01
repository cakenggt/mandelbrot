import {convertIterationsToRGBA} from '../mandelbrot-lib';
import {worker} from './actionCreators/worker-actions';

export default function (dispatch) {
	worker.onmessage = e => {
		if (typeof e.data === 'object') {
			var action = e.data;
			if (action.type === 'GIF_RENDER') {
				// convert iterations data to rgba for each frame
				for (let f = 0; f < action.data.renderedData.length; f++) {
					action.data.renderedData[f] = convertIterationsToRGBA(action.data.renderedData[f], action.data.iterations);
				}
				fetch('/api/v1/gif', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(action.data)
				})
				.then(function (res) {
					return res.json();
				})
				.then(function (json) {
					dispatch({
						type: 'UPDATE_GIF_RENDER_SETTINGS',
						data: {
							datauri: json.datauri
						}
					});
				});
			} else {
				dispatch(action);
			}
		}
	};
}
