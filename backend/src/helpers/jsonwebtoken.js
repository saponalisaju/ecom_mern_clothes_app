const jwt = require("jsonwebtoken");

exports.createToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty string");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("Secret Key must be a non-empty string");
  }
  try {
    return jwt.sign(payload, secretKey, { expiresIn });
  } catch (error) {
    console.error("Failed to sign in the jwt: ", error);
    throw error;
  }
};
