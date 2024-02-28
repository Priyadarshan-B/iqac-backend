const { refreshAccessToken } = require("./google-api");
const User = require("./models/user");

const refreshUserAccessToken = async (refreshToken) => {
  try {
    const newAccessToken = await refreshAccessToken(refreshToken);
    await User.update(
      { accessToken: newAccessToken },
      { where: { refreshToken } }
    );
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

module.exports = { refreshUserAccessToken };
