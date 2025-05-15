const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return next(); // Don't redirect always
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded;
        // console.log(res.locals.use/r )
        next();
    } catch (err) {
         console.error("JWT verification failed:", err.message);

        res.locals.user = null;
        next(); // still render the page, just as a guest
    }
};


const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.redirect("/access-denied")
        }
        next();
    };
};

module.exports = { authenticate, authorizeRole };
