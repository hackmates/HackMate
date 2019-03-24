const axios = require('axios');

/**
 * GET /
 * Hackathons index
 */
exports.index = (req, res) => {
	axios.get('https://mlh-events.now.sh/na-2019')
  		.then(response => { 
			res.render('hackathons', {
			title: 'Hackathons',
			hacks: response.data
		});})
	
};

exports.hacks = (req, res) => {
	// console.log(req);
	axios.get(`https://mlh-events.now.sh/na-2019`)
	// .then(resp => resp.json())
	.then( response => {
		// console.log(response);
		const allHacks = response.data;
		console.log(response.data[0]);
		
		allHacks.forEach( hack => {
			if(hack.name==req.query.hack) {
				res.render('hacks', hack)
			}
		})
		
		// res.render('hacks', {
		// 	hack: response.data[0].name
		// })
	})
	.catch( err => {
		console.log(err);
	});
	
}
