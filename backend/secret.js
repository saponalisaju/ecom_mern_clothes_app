require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 4005;
const mongodbURL =
  process.env.MONGO_URL || "http://127.0.0.1:27017/eComHangerDB";
const secretKey = process.env.SECRET_KEY || "amarsonarbangla";
const jwtActivationKey =
  process.env.JSON_WEB_TOKEN_KEY || "safkeoriweqofdjsf3454350345";
const jwtAccessKey = process.env.JSON_ACCESS_KEY || "mdsaponalijadurhat";
const jwtRefreshKey = process.env.JSON_ACCESS_REFRESH_KEY || "soriedfddfd";
const jwtResetPasswordKey =
  process.env.JSON_RESET_PASSWORD_KEY || "jsonresetpasswordkey";
const defaultImagePath = process.env.DEFAULT_PATH_APPLICATION_DIRECTORY || "";
const defaultPath = process.env.DEFAULT_PATH_SLIDER_DIRECTORY || "";

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";
const smtpEmail = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  defaultPath,
  secretKey,
  jwtActivationKey,
  jwtRefreshKey,
  jwtResetPasswordKey,
  jwtAccessKey,
  clientURL,
  smtpEmail,
  smtpPass,
};
