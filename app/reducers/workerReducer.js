export default function(state = {progress: 0}, action){
  switch (action.type){
    case 'RENDER':
      return action.data;
    case 'PROGRESS':
      return Object.assign({}, state, {
        progress: action.data
      });
    default:
      return state;
  }
}
