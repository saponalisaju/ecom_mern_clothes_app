const cloudinary = require("../config/cloudinary");

const publicIdFromUrl = (secureUrl) => {
  const pathSegments = secureUrl.split("eComHangerDb/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const [publicId] = lastSegment.split(".");
  return "eComHangerDb/" + publicId;
};

const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted successfully from");
    if (typeof result === "object" && result.result === "ok") {
      return result;
    } else {
      throw new Error("Invalid JSON response from Cloudinary");
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};

module.exports = { deleteFileFromCloudinary, publicIdFromUrl };
