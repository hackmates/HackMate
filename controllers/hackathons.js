const axios = require('axios');
const User = require('../models/User');

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
	let userFilter = { hackathons: {} };
	userFilter.hackathons[req.query.hack]=true;

	let hackUsers;

	User.find(userFilter, (err, resp) => {
		if(err) {
			console.log(err)
		} else {
			console.log(resp);
			console.log("From mongo response")
			hackUsers = resp;
		}
	})
	axios.get(`https://mlh-events.now.sh/na-2019`)
	// .then(resp => resp.json())
	.then( response => {
		// console.log(response);
		const allHacks = response.data;
		// console.log(response.data[0]);
		
		allHacks.forEach( hack => {
			if(hack.name==req.query.hack) {
				res.render('hacks', {hack: hack, users: hackUsers})
			}
		});
		
		// res.render('hacks', {
		// 	hack: response.data[0].name
		// })
	})
	.catch( err => {
		console.log(err);
	});
	
}

exports.addHack = (req, res) => {
	console.log(req.query);
	let hack = req.query.hack;
	let updated = {
		hackathons: {}
	};
	updated.hackathons[hack] = true;
	console.log(updated)
	User.findByIdAndUpdate(req.query.userid, updated,
	(err, resp) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect(`/hacks?hack=${hack}`);
		}
	})
}
