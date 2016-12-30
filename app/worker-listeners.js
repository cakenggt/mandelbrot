import {worker} from './actionCreators/worker-actions';
import colorConvert from 'color-convert';

export default function(dispatch, getState){
	worker.onmessage = (e)=>{
		if (typeof e.data == 'object'){
			var action = e.data;
			if (action.type == 'RENDER'){
				var data = action.data.data;
				var canvas = document.getElementById('canvas');
				var ctx = canvas.getContext('2d');
				var imageData = ctx.createImageData(canvas.width, canvas.height);
				var current = 0;
				for (var y = 0; y < data.length; y++){
					var row = data[y];
					for (var x = 0; x < row.length; x++){
						var pixel = row[x];
						if (pixel == action.data.iterations){
							rgb = [0,0,0];
						}
						else{
							var huePercent = pixel;
							while (huePercent > 1){
								huePercent /= 10;
							}
							var rgb = colorConvert.hsl.rgb(Math.floor(huePercent*359), 100, 50);
						}
						imageData.data[current*4] = rgb[0];
						imageData.data[current*4+1] = rgb[1];
						imageData.data[current*4+2] = rgb[2];
						imageData.data[current*4+3] = 255;
						current++;
					}
				}
		    ctx.putImageData(imageData, 0, 0);
			}
			else{
				dispatch(e.data);
			}
		}
	}
}
