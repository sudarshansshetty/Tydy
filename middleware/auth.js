//middleware function to authenticate routers
const auth = async (req, res, next) => {
  try {
    if (req.body && req.body.jwt) {
      next();
    } else {
      res.status(400).send({
        responseMessage: "User Not Authorized",
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
};

module.exports = auth;
