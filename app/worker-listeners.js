import {worker} from './actionCreators/worker-actions';

export default function (dispatch) {
	worker.onmessage = e => {
		if (typeof e.data === 'object') {
			dispatch(e.data);
		}
	};
}
