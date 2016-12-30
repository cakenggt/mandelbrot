var defaultState = {
	origin: '0+0i'
};

export default function (state = defaultState, action) {
	switch (action.type) {
		case 'NAVIGATE':
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
}
