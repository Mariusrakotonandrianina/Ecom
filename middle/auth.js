import passport from 'passport';
import passportLocal from 'passport-local';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import InfoUsers from '../model/signin.js';

const LocalStrategy = passportLocal.Strategy;

const jwtSecretKey = 'rakotonandrianina'; 

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await InfoUsers.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'L\'utilisateur n\'existe pas.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Mot de passe incorrect.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await InfoUsers.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
}

export function generateToken(user) {
  const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '1h' });
  return token;
}
