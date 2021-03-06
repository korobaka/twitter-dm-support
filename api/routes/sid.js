const umodel = require('../../db/models/users');

module.exports = (req, res) => {
    if (!req.session || !req.session.username) {
        res.status(401).send(
            {
                status: 401,
                message: "Please login to access this resource",
            }
        );
        return;
    }
    umodel.findOne({ username: req.session.username })
        .then(result => {
            if (!result) {
                delete req.session.username;
                res.send(
                    {
                        status: 403,
                        message: "Please relogin to access this resource.",
                    }
                );
                return;
            }
            res.send({
                status: 200,
                sid: process.env.USER_ID,
            });
        })
        .catch(() => {
            res.send(
                {
                    status: 500,
                    message: "Internal Server Error",
                }
            );
        });
};