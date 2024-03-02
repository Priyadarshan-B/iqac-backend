const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

const { getCalendarEvents, refreshAccessToken } = require('../routes/auth/accesstoken');
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: {
            [Op.or]: [
              // Use Op.or instead of $or
              { googleId: profile.id },
              { email: profile.emails[0].value },
            ],
          },
        });

        if (user) {
          // User already exists, update the record
          user.displayName = profile.displayName;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await user.save();
          console.log("User updated:", user);

          // Check if access token is not null or undefined
          if (accessToken) {
            const decodedToken = jwt.decode(accessToken);
            if (decodedToken && decodedToken.exp) {
              const expirationTime = decodedToken.exp * 1000; // Convert from seconds to milliseconds
              // Check if the access token is expired
              const tokenExpired = Date.now() >= expirationTime;
              if (tokenExpired) {
                const newAccessToken = await refreshAccessToken(user.refreshToken);
                user.accessToken = newAccessToken;
                await user.save();
              }
              getCalendarEvents(accessToken);
            } else {
              // Handle the case where the 'exp' property is null or undefined
              console.error("Error: Unable to extract expiration time from access token.");
            }
          } else {
            // Handle the case where accessToken is null or undefined
            console.error("Error: Access token is null or undefined.");
          }
        } 
        else {
          // Create a new user
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            accessToken,
            refreshToken,
          });
          await user.save();
          console.log("New user created:", user);
        }

        done(null, user);
      } catch (error) {
        console.error("Error during authentication:", error);
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;


// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/user");
// require("dotenv").config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//       scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log("Google ID received:", profile.id)
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           console.log("Creating new user...");
//           user = new User({
//             googleId: profile.id,
//             displayName: profile.displayName,
//             email: profile.emails[0].value,
//           });
//           await user.save();
//           console.log("New user created:", user);
//         }

//         done(null, user);
//       } catch (error) {
//         console.error("Error during authentication:", error);
//         done(error, false);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findOne({ where: { id } });
//     done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// });

// module.exports = passport;

// clientID: 207769143225-vbmg55s3k3evs99vapl9a8uvql9essg1.apps.googleusercontent.com,
// clientSecret: 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,
