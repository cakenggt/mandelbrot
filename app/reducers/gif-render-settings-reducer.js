var defaultState = {
	zoomFrom: '0.5',
	zoomSpeed: '0.1',
	frameDelay: '16.666',
	gif: null,
	objectURL: ''
};

export default function (state = defaultState, action) {
	switch (action.type) {
		case 'UPDATE_GIF_RENDER_SETTINGS':
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
}
