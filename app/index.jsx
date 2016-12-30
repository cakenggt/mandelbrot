import 'babel-polyfill'; // eslint-disable-line import/no-unassigned-import
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import workerReducer from './reducers/worker-reducer';
import {postData} from './actionCreators/worker-actions';
import addWorkerListeners from './worker-listeners';

var reducer = combineReducers({
	worker: workerReducer
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

var mapDispatchToProps = dispatch => {
	return {
		postData: function (newData) {
			dispatch(postData(newData));
		}
	};
};

var Index = connect(
	mapStateToProps,
	mapDispatchToProps
)(React.createClass({
	getInitialState: function () {
		return {
			data: '{}'
		};
	},
	propTypes: {
		progress: React.PropTypes.number,
		postData: React.PropTypes.func
	},
	render: function () {
		return (
			<div>
				<div>Progress: {this.props.progress}</div>
				<input
					value={this.state.data}
					onChange={this.handleChangeInput}
					/>
				<span
					onClick={this.handleSendClick}
					>
					Send
				</span>
				<canvas
					id="canvas"
					width={400}
					height={300}
					/>
			</div>
		);
	},
	handleChangeInput: function (e) {
		this.setState({
			data: e.target.value
		});
	},
	handleSendClick: function () {
		var json = JSON.parse(this.state.data);
		this.props.postData(json);
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
