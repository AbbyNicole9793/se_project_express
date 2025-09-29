const express = require("express")
const mongoose = require("mongoose")
const indexRouter = require("./routes/index")

const app = express()

const {PORT = 3001} = process.env



mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log("Connected")
  })
  .catch(console.error)

app.use(express.json())
app.use((req, res, next) => {
  req.user = {
    _id: '68d9ba9feecefa64ebb1e906'
  };
  next();
});
app.use("/", indexRouter)
app.use((req, res, next) => {
  res.status(404).send({
  "message": "Requested resource not found"
})
  next()
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

