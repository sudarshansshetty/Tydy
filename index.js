var express = require("express");
var app = express();
const fs = require("fs");
const multer = require("multer");
const users = require("./users.json");
const auth = require("./middleware/auth");
const bodyparser = require("body-parser");
const fileUpload = multer({ dest: "./images" });
require("dotenv").config();

app.use(bodyparser.json());

//To Get the list of All users
app.get("/testapp/get", async (req, res) => {
  try {
    res.status(200).send({
      responseMessage: "Success",
      responseData: users,
    });
  } catch (e) {
    console.log("Error -> ", e);
    res.status(500).send({
      responseMessage: "Internal Server Error",
      responseData: e,
    });
  }
});

//To get the detail of the single user by his id
app.get("/testapp/get/:id", async (req, res) => {
  try {
    let user = users.filter((user) => user.id == req.params.id)[0];
    res.status(200).send({
      responseMessage: "Success",
      responseData: user || null,
    });
  } catch (e) {
    console.log("Error -> ", e);
    res.status(500).send({
      responseMessage: "Internal Server Error",
      responseData: e,
    });
  }
});

//to update the user name
app.post("/testapp/updateuser", auth, async (req, res) => {
  try {
    let objIndex = users.findIndex((obj) => obj.id == req.body.id);
    let user = users[objIndex];

    if (user) {
      if (req.body.hasOwnProperty("lname")) {
        res.status(200).send({
          responseMessage: "Cannot update the field - lname",
          responseData: {},
        });
        return;
      } else if (user.fname == req.body.fname) {
        res.status(200).send({
          responseMessage: "Already Have Same fname",
          responseData: {},
        });
        return;
      }
      users[objIndex].fname = req.body.fname;
      fs.writeFileSync("./users.json", JSON.stringify(users), {
        encoding: "utf8",
        flag: "w",
      });
      res.status(200).send({
        responseMessage: "Success",
        responseData: users[objIndex] || null,
      });
    } else {
      res.status(200).send({
        responseMessage: "User does not Exist",
        responseData: {},
      });
    }
  } catch (e) {
    console.log("Error -> ", e);
    res.status(500).send({
      responseMessage: "Internal Server Error",
      responseData: {},
    });
  }
});

//To add a profile pic to the user
app.post(
  "/testapp/addprofilepic",
  fileUpload.single("file"),
  auth,
  async (req, res) => {
    try {
      let objIndex = users.findIndex((obj) => obj.id == req.body.id);
      let user = users[objIndex];

      if (user) {
        let filePath = req.file.path.split("/");
        users[objIndex].profilepath = req.file.destination + "/" + filePath[1];

        fs.writeFileSync("./users.json", JSON.stringify(users), {
          encoding: "utf8",
          flag: "w",
        });
        res.status(200).send({
          responseMessage: "Success",
          responseData: users[objIndex],
        });
      } else {
        res.status(200).send({
          responseMessage: "User does not Exist",
          responseData: {},
        });
      }
    } catch (e) {
      console.log("Error -> ", e);
      res.status(500).send({
        responseMessage: "Internal Server Error",
        responseData: e,
      });
    }
  }
);

//Server will be running in a port number which is from .env
app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server running on port ${process.env.PORT_NUMBER}`);
});
