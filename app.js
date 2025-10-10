const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const indexRouter = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");
const { login, createUser } = require("./controllers/users")
const auth = require('./middleware/auth');


const app = express()

const { PORT = 3001 } = process.env;



mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log("Connected")
  })
  .catch(console.error)

app.use(express.json())
app.use(cors())

app.post('/signin', login);
app.post('/signup', createUser);



app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133",}
next()
})


app.use(auth)
app.use("/", indexRouter)

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

