export const worker = new Worker('/js/worker.js');

export function startRender(data) {
	return function (dispatch, getState) {
		dispatch({
			type: 'UPDATE_RENDER_SETTINGS',
			data: data
		});
		worker.postMessage(getState().renderSettings);
	};
}
