const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Request = require('../models/requests');

exports.createUser = (req, res, next) => {
    // First check if user already exists
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(401).json({
                    message: "This email is already registered"
                });
            }

            // If user doesn't exist, proceed with registration
            return bcrypt.hash(req.body.password, 10);
        })
        .then(hash => {
            if (!hash) return; // Skip if user already exists

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });

            return user.save();
        })
        .then((result) => {
            if (!result) return; // Skip if user already exists

            res.status(201).json({
                message: 'User created successfully!',
                userId: result._id
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Invalid authentication credentials!"
            });
        });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "This email is not registered"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'secret_this_should_be_longer',
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        });
}

exports.addFavourite = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.favourites.push(eventId);
        await user.save();

        return res.status(200).json({
            message: 'Event added to favorites'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to add event to favorites'
        });
    }

}

exports.removeFavourite = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.favourites = user.favourites.filter(id => id.toString() !== eventId);
        await user.save();

        return res.status(200).json({
            message: 'Event removed from favorites'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to remove event from favorites'
        });
    }
}


exports.getFavourites = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Favorites retrieved successfully',
            favourites: user.favourites
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve favorites'
        });
    }
};

exports.addAttendedEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        user.attendedEvents.push(eventId);
        await user.save();
        return res.status(200).json({
            message: 'Event added to attended events'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to add event to attended events'
        });
    }
}

exports.getAttendedEvents = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            message: 'Attended events retrieved successfully',
            attendedEvents: user.attendedEvents
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve attended events'
        });
    }
}

exports.removeAttendedEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        user.attendedEvents = user.attendedEvents.filter(id => id.toString() !== eventId);
        await user.save();
        return res.status(200).json({
            message: 'Event removed from attended events'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to remove event from attended events'
        });
    }
}

exports.getUserRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'role retrieved successfully',
            role: user.role
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve role'
        });
    }
}

exports.makeRequest = async (req, res) => {
    try {
        const userId = req.params.userId;
        const existingRequest = await Request.findOne({ userId: userId });
        if (existingRequest) {
            return res.status(400).json({
                message: 'Request already exists'
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const request = new Request({
            userId: userId,
            userName: user.name,
            userEmail: user.email,
            userRole: user.role
        });
        await request.save();
        return res.status(200).json({
            message: 'Request sent successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to send request'
        });
    }
}
exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        return res.status(200).json({
            message: 'Requests fetched successfully',
            requests: requests
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch requests'
        });
    }
}

exports.approveRequest = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        user.role = 'admin';
        await user.save();
        await Request.deleteOne({ userId: userId });
        return res.status(200).json({
            message: 'User approved successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to approve user'
        });
    }
}



