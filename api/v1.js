'use strict';
var GifEncoder = require('gif-encoder');

const prefix = '/api/v1/';

module.exports = function (options) {
	// This is your express app object
	let app = options.app;
	let encoding = 'base64';

	/**
	 * All of your api routes go here.
	 * Format them in the following way:
	 * app.post(prefix+'endpoint', callback);
	 * app.get(prefix+'endpoint', callback);
	 */

	app.post(prefix + 'gif', function (req, res) {
		var body = req.body;
		if (!body.width || !body.height || !body.renderedData) {
			res.status(400).end();
			return;
		}
		var gif = new GifEncoder(body.width, body.height);
		var totalBuffer;
		gif.on('data', function (data) {
			if (totalBuffer === undefined) {
				totalBuffer = data;
			} else {
				totalBuffer = Buffer.concat([totalBuffer, data]);
			}
		});
		gif.on('end', function () {
			res.status(200).json({datauri: totalBuffer.toString(encoding)}).end();
		});
		gif.setRepeat(0);
		gif.setFrameRate(60);
		gif.writeHeader();
		for (let i = 0; i < body.renderedData.length; i++) {
			let frame = body.renderedData[i];
			gif.addFrame(frame);
		}
		gif.finish();
	});
};
