const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { errors } = require('celebrate');
require('dotenv').config()
const indexRouter = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors/errors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require('./middlewares/error-handler');

const { requestLogger, errorLogger } = require('./middlewares/logger');


const app = express()

const { PORT = 3001 } = process.env;



mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log("Connected")
  })
  .catch(console.error)

app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(requestLogger)

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', createUser);
app.post('/signin', login);
app.use("/items", require("./routes/clothingItems"))


app.use(auth)
app.use("/", indexRouter)

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.use(errorLogger)

app.use(errors())

app.use(errorHandler);

module.exports = app;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
