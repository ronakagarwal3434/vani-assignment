const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");

require("dotenv").config();

const app = express();
const http = require("http").createServer(app);

// db
mongoose
    .connect(process.env.DATABASE || "mongodb://localhost:27017/vani_ass", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected!"))
    .catch((err) => console.log("DB connection error", err));

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// autoload routes
app.get("/", (req, res) =>
  res.status(200).json({ message: "Hello from server" })
);
readdirSync("./routes/client").map((r) => app.use("/api", require(`./routes/client/${r}`)));
readdirSync("./routes/admin").map((r) => app.use("/api/admin", require(`./routes/admin/${r}`)));

const port = process.env.PORT || 8000;
http.listen(port, () =>
  console.log(`Server is up and running on port: ${port}`)
);
