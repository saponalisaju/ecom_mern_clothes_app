const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

require("./src/config/database");
const userRouter = require("./src/routes/userRoutes");
const profileRouter = require("./src/routes/profileRoute");
const productRouter = require("./src/routes/productRoutes");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5173",
  "https://jobsvisaonline.com",
  "https://jobsvisaonline.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Accept, Authorization",
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/images", express.static("upload/images"));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/product", productRouter);

module.exports = app;
