export const worker = new Worker('/js/worker.js');

export function startRender() {
	return function (dispatch, getState) {
		var renderSettings = getState().renderSettings;
		renderSettings = {
			origin: renderSettings.origin,
			zoom: parseFloat(renderSettings.zoom),
			width: parseInt(renderSettings.width, 10),
			height: parseInt(renderSettings.height, 10),
			iterations: parseInt(renderSettings.iterations, 10),
			escape: parseFloat(renderSettings.escape),
			equation: renderSettings.equation
		};
		worker.postMessage(renderSettings);
	};
}
