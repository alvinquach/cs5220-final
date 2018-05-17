'use strict';

const router = require('express').Router();
const auth = require('../auth');
const Ticket = require('../models/ticket.model');

router.post('/', (req, res, next) => {
    const data = req.body;
    if (!data.subject || !data.createdForName || !data.createdForEmail || !data.unit) {
        return res.status(400).json({message: "Missing required field(s)."});
    }
    const ticket = {
        createdBy: {
            _id: req.user._id
        },
        createdForName: data.createdForName,
        createdForEmail: data.createdForEmail,
        subject: data.subject,
        details: data.details,
        unit: {
            _id: data.unit // The unit in the request should just be the id.
        }
    }
    new Ticket(ticket).save((err, ticket) => {
        if (err) {
            return res.status(500).json({message: "Mongo error"});
        }
        res.send(ticket);
    });
});

router.get('/search', (req, res, next) => {
    const term = req.query.term;
    if (!term) {
        return res.status(400).json({message: "Search term cannot be empty."});
    }
    const requestor = req.user;
    const unitId = req.query.unitId;
    const userId = req.query.userId;

    // This operation can be performed only by administrators.
    if (unitId == null && userId == null && requestor.roles.indexOf('ADMIN') == -1) {
        return accessDenied(res);
    }

    // This operation can be performed by administrators, or the supervisors and technicians of the unit.
    if (unitId != null && (!requestor.roles.length || (requestor.roles.indexOf('ADMIN') == -1 && requestor.unit != unitId))) {
        return accessDenied(res);
    }

    // This operation can be performed by administrators or the user him/herself.
    if (userId != null && requestor.roles.indexOf('ADMIN') == -1 && requestor._id != userId) {
        return accessDenied(res);
    }

    Ticket.find({
        $text: {
			$search: term
		}
    })
    .exec((err, tickets) => {
        res.json(tickets.filter(t => (unitId != null ? unitId == t.unit : true) && (userId != null ? userId == t.createdBy : true)));
    });

});

const accessDenied = (res) => {
    res.status(403).json({message: "Access denied."});
};

module.exports = router;
