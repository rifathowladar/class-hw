
function security(req, res, next) {
    if (req.headers.authorization = "password") {
        next()
    }else{
        res.json({
            message: 'jaw akhan theke'
        })
    }
}

module.exports = security