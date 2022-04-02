const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const databaseConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");

/*assuming an express app is declared here*/
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));
app.use(cors());

const authRouter = require("./routes/authRoute");
const messengerRoute = require("./routes/messengerRoute");

app.use("/api/messenger", messengerRoute);

app.use("/api/messenger", authRouter);




const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("This is from backend Sever");
});

databaseConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
