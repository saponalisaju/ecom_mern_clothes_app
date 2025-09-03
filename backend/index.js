const app = require("./app");
const connectDB = require("./src/config/database");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`Server Running at http://localhost:${serverPort}`);
  await connectDB();
});

// const port = 4000;
// const app = require("./app");

// app.listen(port, (error) => {
//   if (!error) {
//     console.log("Server Running on port " + port);
//   } else {
//     console.log("Error : " + error);
//   }
// });
