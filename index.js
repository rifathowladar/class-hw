import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()
const port = process.env.PORT || 2000


app.use(express.json())

app.post('/hw', (req, res) => {
    let {name,email,password,gender} = req.body
    
    let error = {}

    if (!name) {
        error.name = "Name Card cai"
    }
    if (!email) {
        error.email = "Email Card cai"
    }
    if (!password) {
        error.password = "Password Card cai"
    }
    if (!gender) {
        error.gender = "Gender Card cai"
    }
    if (error.name || error.email || error.password || error.gender) {
        return res.send(error)
    }
    
  res.send('<h1>HW done</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})