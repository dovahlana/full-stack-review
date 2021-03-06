const bcrypt = require('bcryptjs');

const register = (req, res) => {
    const db = req.app.get('db')
    const {username, password, profile_img} = req.body;
    bcrypt.hash(password, 12).then((hash) => {
        db.authentication.registerUser([username, hash, profile_img])
            .then(user => {
                res.sendStatus(200)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json('Terminator is coming for you')
            })
    }).catch(error => {
        console.log(error)
        res.status(500).json('Internal Server Error')
    })
}

const login = (req, res) => {
    const db = req.app.get('db')
    const {username, password} = req.body;
    db.authentication.getUser(username).then(user => {
        if(user.length === 0) {
            res.status(400).json('user does not exist in skynet database')
        } else {
            bcrypt.compare(password, user[0].password).then(areEqual => {
                if(areEqual) {
                    const {user_id, username, profile_img} = user[0]
                    req.session.user = {
                        id: user_id,
                        username: username,
                        profile_img: profile_img
                    }
                    console.log(req.session.user)
                    res.status(200).json(username)
                } else {
                    res.status(403).json('incorrect username or password, a T1000 has been dispatched to your location')
                }
            })
        }
    })
}

const lOgOuT = (req, res) => {
    req.session.destroy();
    res.sendStatus(200)
}

module.exports = {
    register,
    login,
    lOgOuT
}