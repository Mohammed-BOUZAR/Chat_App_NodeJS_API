require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = require("#routes/auth");
const users = require("#routes/user");
const chats = require("#routes/chat");

const { isAuth } = require("#middlewares/auth");
const { STATUS_CODE } = require("#enums/status_code");

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", isAuth, users);
app.use("/api/v1/chats", isAuth, chats);

app.use((req, res) => {
  res.status(STATUS_CODE.NOT_FOUND).json({ message: "Page Not Found!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
