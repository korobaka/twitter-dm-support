const
    bcrypt = require('bcrypt'),
    umodel = require('../../db/models/users');

module.exports = (req, res) => {
    if (!req.body) {
        res.redirect("/login?message=Bad%20request");
    }
    const { username, password } = req.body;
    if (!username || !password) {
        let url = "/login?message=Some%20fields%20are%20missing";
        if (username) url+=`&prefill=${username}`;
        res.redirect(url);
        return;
    }
    umodel.findOne({ username }).then(result => {
        if (!result) {
            res.redirect("/login?message=The%20user%20"+username+"%20does%20not%20exist");
            return;
        }
        bcrypt.compare(password, result.password, (error, rs) => {
            if (error) {
                res.redirect("/login?message=An%20internal%20error%20occured,%20please%20retry");
                return;
            }
            if (!rs) {
                res.redirect(`/login?message=Wrong%20password&prefill=${username}`);
                return;
            }
            req.session.username = username;
            res.redirect("/");
        });
    })
    .catch((e) => {
        console.error(e);
        res.redirect("/login?message=An%20internal%20error%20occured,%20please%20retry");
    });
}