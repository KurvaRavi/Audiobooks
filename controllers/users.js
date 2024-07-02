const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body.user;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash('error', 'Email already registered');
            return res.redirect('register');
        }

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            req.flash('error', 'Username already taken');
            return res.redirect('register');
        }
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to KukuFM!');
            res.redirect('/audiobooks');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/audiobooks';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/audiobooks');
}