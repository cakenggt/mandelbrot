import 'babel-polyfill'; // eslint-disable-line import/no-unassigned-import
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
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
		progress: React.PropTypes.string
	},
	render: function () {
		return (
			<div>
				<div>Progress: {this.props.progress}</div>
				<RenderSettings/>
				<RenderView/>
				<NavigationView/>
				<GifRenderSettings/>
			</div>
		);
	}
}));

var router = (
	<Router history={browserHistory}>
		<Route path="/" >
			<IndexRoute component={Index}/>
		</Route>
	</Router>
);

render(
	<Provider store={store}>{router}</Provider>,
	document.getElementById('app')
);
