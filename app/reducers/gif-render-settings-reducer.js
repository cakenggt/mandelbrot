var defaultState = {
	zoomFrom: '0.5',
	speed: '0.1',
	datauri: ''
};

export default function (state = defaultState, action) {
	switch (action.type) {
		case 'UPDATE_GIF_RENDER_SETTINGS':
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
}
