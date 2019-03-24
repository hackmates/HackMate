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
	let userFilter = {};
	let hack = req.query.hack.replace(/\s/g, '');
	userFilter[`hackathons.${hack}.isOpen`]=true;
	console.log(userFilter);
	console.log("UserFilter");
	let hackUsers;

	User.find(userFilter, (err, resp) => {
		if(err) {
			console.log(err)
		} else {
			console.log(resp);
			console.log("response")
			//console.log("From mongo response")
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
	//console.log(req.query);
	let hack = req.query.hack.replace(/\s/g, '');
	console.log(hack)
	let updated;
	User.findById(req.query.userid, (err, resp) => {
		//console.log(resp);
		// let newH = resp;
		updated = resp;
		// console.log(resp.hackathons);
		// console.log("Old value");

		updated.hackathons[hack] = { 
			isOpen: true,
			team: []
		};
		// console.log(updated.hackathons);
		// console.log(updated.hackathons[hack])
		// console.log("New Append");
		User.findByIdAndUpdate(req.query.userid, updated,
			(err, respo) => {
				if(err) {
					console.log(err);
				} else {
					res.redirect(`/hacks?hack=${req.query.hack}`);
				}
			}
		)
	})
	// console.log(updated);
	//console.log(updated)
	// console.log(updated);
	// console.log("Old one")
	
}

exports.teams = (req, res) => {
	res.render('teams');
}
