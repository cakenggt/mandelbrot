export const worker = new Worker('/js/worker.js');

export function postData(data) {
	return function () {
		var canvas = document.getElementById('canvas');
		data.width = canvas.width;
		data.height = canvas.height;
		worker.postMessage(data);
	};
}
