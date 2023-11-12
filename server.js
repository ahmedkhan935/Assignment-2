const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth');
app.use(express.json());

app.use("/auth", authRoute);
app.use("/", require("./routes/blogs"));
app.use("/", require("./routes/user-management"));
app.use("/", require("./routes/search"));
app.use("/admin", require("./routes/admin"));
mongoose.connect("mongodb://127.0.0.1:27017/A02").then(() => {
    console.log("connected to db");
}
).catch((err) => {
    console.log(err);
})

app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`)
    }

)



