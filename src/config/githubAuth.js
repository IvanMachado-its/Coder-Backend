const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

console.log("Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("Client Secret:", process.env.GITHUB_CLIENT_SECRET);
console.log("Callback URL:", process.env.GITHUB_CALLBACK_URL);

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = await User.create({ 
        username: profile.username,
        githubId: profile.id,
        profileUrl: profile.profileUrl
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
