import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import workerReducer from './reducers/workerReducer.js';
import {postData} from './actionCreators/worker-actions.js';
import addWorkerListeners from './worker-listeners';

var reducer = combineReducers({
  worker: workerReducer
});

var store = createStore(
  reducer,
  applyMiddleware(thunk)
);

addWorkerListeners(store.dispatch, store.getState);

var mapStateToProps = (state) => {
  return {
    progress: state.worker.progress
  }
}

var mapDispatchToProps = (dispatch) => {
  return {
    postData: function(newData){
      dispatch(postData(newData));
    }
  }
}

var Index = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({
  getInitialState: function(){
    return {
      data: '{}'
    };
  },
  render: function() {
    return (
      <div>
        <div>Progress: {this.props.progress}</div>
        <input
          value={this.state.data}
          onChange={this.changeInput}/>
        <span
          onClick={this.sendData}>Send</span>
        <canvas
          id="canvas"
          width={400}
          height={300}/>
      </div>
    );
  },
  changeInput: function(e){
    this.setState({
      data: e.target.value
    });
  },
  sendData: function(){
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
