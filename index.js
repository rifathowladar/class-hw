require('dotenv').config();
const express = require('express');
const app = express();
const Task = require('./models/todoModel')
const security = require('./middleware/security')
const database = require('./config/mongodbConfig')
const {registrationController} = require('./controller/registrationController')
const multer = require('multer');
app.use(express.json())
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 2000
database()


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
;
  cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/registration',security,upload.single('profile') , registrationController)

//Create task
app.post('/create/todo',async (req, res) => {
  let { task, priority } = req.body
  if (!task) {
    return res.status(400).send("task dew")
  }

  let todo = await new Task({
    task: task,
    priority: priority
  }).save()
  res.send(todo)
});
// Show tasks
app.get('/all/tasks', async (req, res) => {
  let data = await Task.find({})
  res.send(data)
})
// Delete
app.delete('/delete/:id',async (req, res) => {
  const {id} = req.params
  await Task.findByIdAndDelete(id);
  res.send("delete")
})
// Update
app.post('/update/:id',async (req, res) => {
  const {id} = req.params
  let update = await Task.findByIdAndUpdate({_id: id}, req.body,{new: true});
  res.send("update")
})


app.listen(port, () => {
  console.log(`server connected`)
})
