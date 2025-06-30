const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        if(user.email === req.body.email){
            return res.status(401).json({
                message: "This email is already registered"
            });
        }
       
        user.save().then((result) => {
            res.status(201).json({
                message: 'User created successfully!',
                userId: result._id
            });
        }).catch(err => {
            res.status(500).json({
                message: "Invalid authentication credentials!"
            });
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

exports.getUserRole = async(req, res) => {
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
       const user = await User.findById(userId);
       if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
       }    
       const request = new Request({
        userId: userId,
        userName: user.name,
        userEmail: user.email
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


