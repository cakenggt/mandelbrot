var defaultState = {
	progress: '0',
	renderedData: [],
	timestamp: 0,
	iterations: 0,
	zoom: 0,
	origin: '0+0i',
	height: 300,
	width: 400
};

export default function (state = defaultState, action) {
	switch (action.type) {
		case 'PROGRESS':
			return Object.assign({}, state, {
				progress: action.data
			});
		case 'UPDATE_WORKER_STATE':
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
}
