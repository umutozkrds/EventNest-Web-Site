const Event = require('../models/event');
const mongoose = require('mongoose');

exports.createEvent = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');

    // If image is uploaded via Cloudinary, use that URL
    const imagePath = req.file ? req.file.path : undefined;

    const event = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        location: req.body.location,
        category: req.body.category,
        creator: req.userData.userId,
        imagePath: imagePath
    });
    event.save().then((result) => {
        res.status(201).json({
            message: 'Event added successfully!',
            event: result
        });
    }).catch((err) => {
        console.error("Error creating event:", err);
        res.status(500).json({
            error: err
        });
    });
}

exports.getEvents = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    
    const eventQuery = Event.find({status: "approved"});
    let fetchedEvents;

    if (pageSize && currentPage) {
        eventQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    eventQuery
        .then(documents => {
            fetchedEvents = documents;
        })
        .then(count => {
            res.status(200).json({
                message: "Events fetched successfully!",
                events: fetchedEvents,
                maxEvents: count
            });
        })
        .catch(error => {
            console.error("Error fetching events:", error);
            res.status(500).json({
                message: "Fetching events failed!"
            });
        });
}

exports.getPendingEvents = (req, res, next) => {
    Event.find({status: "pending"})
        .then(events => {
            res.status(200).json({
                message: "Pending events fetched successfully!",
                events: events
            });
        })
        .catch(error => {
            console.error("Error fetching pending events:", error);
            res.status(500).json({
                message: "Fetching pending events failed!"
            }); 
        });
}

exports.getEvent = (req, res, next) => {
    Event.findById(req.params.id)
        .then(event => {
            if (event) {
                res.status(200).json({
                    message: 'Event fetched successfully!',
                    event: event
                });
            } else {
                res.status(404).json({ message: 'Event not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching event failed!"
            });
        });
}

exports.getEventsByCreator = (req, res, next) => {
    Event.find({ creator: req.params.userId })
        .then(events => {
            if (events) {
                res.status(200).json({
                    message: 'Events fetched successfully!',
                    events: events
                });
            } else {
                res.status(404).json({ message: 'No events found for this user!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching events failed!"
            });
        });
}

exports.updateEvent = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        // If new file is uploaded, use the Cloudinary URL
        imagePath = req.file.path;
    }

    const event = new Event({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        location: req.body.location,
        category: req.body.category,
        creator: req.userData.userId,
        imagePath: imagePath
    });

    Event.updateOne({ _id: req.params.id, creator: req.userData.userId }, event)
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            console.error("Error updating event:", error);
            res.status(500).json({
                message: "Couldn't update event!"
            });
        });
}

exports.deleteEvent = (req, res, next) => {
    Event.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: "Deletion successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Deleting event failed!"
            });
        });
}



exports.approveEvent = (req, res, next) => {
    const eventId = req.params.id;
    const User = require('../models/user');

    // First check if user has admin role
    User.findById(req.userData.userId)
        .then(user => {
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied! Admin role required.' });
            }

            // If user is admin, proceed with approval
            return Event.findById(eventId);
        })
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: 'Event not found!' });
            }

            event.status = "approved";
            return event.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Event approved successfully!',
                event: result
            });
        })
        .catch(error => {
            console.error("Error approving event:", error);
            res.status(500).json({
                message: "Approving event failed!",
                error: error
            });
        });
}

exports.rejectEvent = (req, res, next) => {
    const eventId = req.params.id;
    const User = require('../models/user');

    // First check if user has admin role
    User.findById(req.userData.userId)
        .then(user => {
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied! Admin role required.' });
            }

            // If user is admin, proceed with rejection
            return Event.findById(eventId);
        })
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: 'Event not found!' });
            }

            event.status = "rejected";
            return event.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Event rejected successfully!',
                event: result
            });
        })
        .catch(error => {
            console.error("Error rejecting event:", error);
            res.status(500).json({
                message: "Rejecting event failed!",
                error: error
            });
        });
}

