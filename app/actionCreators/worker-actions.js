export const worker = new Worker("/js/worker.js");

export function postData(data){
  return function (dispatch, getState){
    var canvas = document.getElementById('canvas');
    data.width = canvas.width;
    data.height = canvas.height;
    worker.postMessage(data);
  }
}
