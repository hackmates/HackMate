const axios = require('axios');
const User = require('../models/User');


function parseUser(user) {

	let reqLen = Object.keys(user.hackathons).length;
	console.log(reqLen);

	let hackathons = {};

	for(let hack in user.hackathons) {
		// console.log(hack);
		let team = [user];
		// console.log(user.hackathons[hack].isOpen);
		if(!user.hackathons[hack].isOpen ) {
			// console.log("Inside if");

				console.log(hack);
				User.findById(user.hackathons[hack].team[0],
					(teamErr, teamRes) => {
						if(teamErr) {console.log(teamErr);}
						// console.log(teamRes);
						// console.log("teamRes");
						team.push(teamRes);
						hackathons[hack] = team;
						console.log("IF part")
						console.log(Object.keys(hackathons).length);
						// console.log(team);
						// console.log("final team")
					}
				)
		}
		setTimeout(() => {
			if(user.hackathons[hack].isOpen) {
			//console.log("Inside else");
			hackathons[hack] = team;
			console.log("Else part")
			console.log(hackathons)
			console.log(Object.keys(hackathons).length);
			}
		},
		2000);
		console.log("YOHO")
		console.log(Object.keys(hackathons).length)
	}
	return hackathons;
	// while(true) {
		
	// 	if(Object.keys(hackathons).length===reqLen+1) {
	// 		console.log("returned");
	// 		return hackathons;
	// 	} else {
	// 		//console.log("Nyet");
	// 	}
	// }
	// return hackathons;



	// setInterval(()=>{
	// 	if(Object.keys(hackathons).length===reqLen) {
	// 		console.log(hackathons);
	// 		return hackathons;}
	// 	else {console.log("Nyet")}
	// }, 1000)

	// let flag;
	// while(true) {
	// 	flag = 0;
	// 	for(let hack in user.hackathons) {
	// 		if(hackathons[hack]===undefined) {
	// 			console.log(hackathons[hack]);
	// 			flag = 1;
	// 		} else {
	// 			console.log(hackathons[hack]);
	// 		}
	// 	}
	// 	if(flag==0) { 
	// 		console.log(hackathons);
	// 		console.log("Final")
	// 		return hackathons;
	// 	}
	// 	//else {flag=0;}
	// }
	// console.log(hackathons);
	// return hackathons;
}
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
	// const userID = req._passport.instance.session;
	const userID = req.user._id;
	console.log(userID);

	User.findById(userID,
		(err, resp) => {
			if(err) {
				console.log(err);
			} else {
				let payload = parseUser(resp);
				console.log("Inside payload")
				console.log(payload);
				console.log(Object.keys(payload).length);
				res.render('teams', payload);
			}
		})
	
}

exports.acceptTeam = (req, res) => {
	const hack = req.query.hack.replace(/\s/g, '');
	const teamOwnerID = req.query.teamOwner;
	const teamUserID = req.query.teamUser;

	let ownerUpdated;
	let userUpdated;

	User.findById(teamOwnerID,
		(ownErr, ownResp) => {
			if(ownErr) {console.log(ownErr);}
			ownerUpdated = ownResp;
			User.findById(teamUserID,
				(userErr, userResp) => {
					if(userErr) {console.log(userErr);}
					userUpdated = userResp;

					let ownArr = [teamUserID];
					ownerUpdated.hackathons[hack] = { 
						isOpen: false,
						team: ownArr
					};
					console.log(ownerUpdated);
					console.log("ownerUpdated");

					let userArr = [teamOwnerID];
					userUpdated.hackathons[hack] = {
						isOpen: false,
						team: userArr
					};
					console.log(userUpdated);
					console.log("userUpdated");

					User.findByIdAndUpdate(teamOwnerID, ownerUpdated,
						(err, respo) => {
							if(err) {console.log(err);}
							User.findByIdAndUpdate(teamUserID, userUpdated,
								(err, respo) => {
									if(err) {console.log(err)}
									else {res.redirect('/teams');}
								})
						})

				})
		})
	//res.render('/teams')
}
