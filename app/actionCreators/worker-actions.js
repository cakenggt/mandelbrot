export const worker = new Worker('js/worker.js');

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
		worker.postMessage({
			type: 'SINGLE_FRAME_RENDER',
			data: renderSettings
		});
	};
}

export function startGifRender() {
	return function (dispatch, getState) {
		var state = getState();
		var renderSettings = state.renderSettings;
		var gifRenderSettings = state.gifRenderSettings;
		renderSettings = {
			origin: renderSettings.origin,
			zoomFrom: parseFloat(gifRenderSettings.zoomFrom),
			zoomSpeed: parseFloat(gifRenderSettings.zoomSpeed),
			zoomTo: parseFloat(renderSettings.zoom),
			frameDelay: parseFloat(gifRenderSettings.frameDelay),
			width: parseInt(renderSettings.width, 10),
			height: parseInt(renderSettings.height, 10),
			iterations: parseInt(renderSettings.iterations, 10),
			escape: parseFloat(renderSettings.escape),
			equation: renderSettings.equation
		};
		worker.postMessage({
			type: 'GIF_RENDER',
			data: renderSettings
		});
	};
}
