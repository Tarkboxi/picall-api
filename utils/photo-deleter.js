const fs = require('fs');
const pathResolve = require('../properties/fs-path-resolve');

module.exports = (urls, headers) => {
	return Promise.all( 
		urls.map( url =>
			new Promise((resolve, reject) => {
			try {
				url = pathResolve(url);
				fs.unlink(url, err => {
					if (err) throw err;
				});
				resolve();
			} catch (err) {
				console.error(err);
				reject(err);
			}
			})
		)
	);
}