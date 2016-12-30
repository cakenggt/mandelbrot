var defaultState = {
	progress: 0,
	renderedData: [],
	timestamp: 0,
	iterations: 0
};

export default function (state = defaultState, action) {
	switch (action.type) {
		case 'RENDER':
			return Object.assign({}, state, {
				renderedData: action.data.renderedData,
				timestamp: action.data.timestamp,
				iterations: action.data.iterations
			});
		case 'PROGRESS':
			return Object.assign({}, state, {
				progress: action.data
			});
		default:
			return state;
	}
}
