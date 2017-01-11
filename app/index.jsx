import 'babel-polyfill'; // eslint-disable-line import/no-unassigned-import
import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import workerReducer from './reducers/worker-reducer';
import renderSettingsReducer from './reducers/render-settings-reducer';
import navigationReducer from './reducers/navigation-reducer';
import gifRenderSettingsReducer from './reducers/gif-render-settings-reducer';
import addWorkerListeners from './worker-listeners';
import RenderView from './components/render-view.jsx';
import RenderSettings from './components/render-settings.jsx';
import NavigationView from './components/navigation-view.jsx';
import GifRenderSettings from './components/gif-render-settings.jsx';

var reducer = combineReducers({
	worker: workerReducer,
	renderSettings: renderSettingsReducer,
	navigation: navigationReducer,
	gifRenderSettings: gifRenderSettingsReducer
});

var store = createStore(
	reducer,
	applyMiddleware(thunk)
);

addWorkerListeners(store.dispatch, store.getState);

var mapStateToProps = state => {
	return {
		progress: state.worker.progress
	};
};

var Index = connect(
	mapStateToProps,
)(React.createClass({
	propTypes: {
		progress: React.PropTypes.number
	},
	render: function () {
		return (
			<div>
				<div
					className="progress-bar"
					>
					<div
						className="progress-bar-inner"
						style={{
							width: (this.props.progress * 100) + '%'
						}}
						/>
				</div>
				<div
					className="container"
					>
					<RenderSettings/>
					<RenderView/>
					<div
						className="right-pane bordered"
						>
						<NavigationView/>
						<GifRenderSettings/>
					</div>
				</div>
			</div>
		);
	}
}));

render(
	<Provider store={store}><Index/></Provider>,
	document.getElementById('app')
);
