require("dotenv").config();
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload")

const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use("/api", router)

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`server start on port ${5000}`));
  } catch (e) {
    console.log(e);
  }
};

start();
