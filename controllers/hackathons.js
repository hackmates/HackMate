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