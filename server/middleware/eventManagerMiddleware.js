module.exports = (req, res, next) => {
    if (
        req.user.role === "eventManager" ||
        req.user.role === "admin"
    ) {
        next();
    } else {
        res.status(403).json({
            message: "Only Event Managers allowed"
        });
    }
};