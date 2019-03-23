/**
 * GET /
 * Hackathons index
 */
exports.index = (req, res) => {
	res.render('hackathons', {
		title: 'Hackathons'
	});
};