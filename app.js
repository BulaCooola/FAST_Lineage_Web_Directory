import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');
app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(
  session({
    name: 'AuthState',
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false
  })
);
//TODO: add middleware
app.use('/', (req, res, next) => {
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl} ${(req.session.user) ? "Authenticated User" : "Non-Authenticated User"}`)
  console.log(req.cookies);
  next();
});

app.use('/users/register', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/users/profile');
  }
  next();
});

app.use('/users/profile', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
});

app.use('/users/profile/edit', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
});

app.use('/users/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/users/profile');
  }
  else {
    next();
  }
});

app.use('/lines/myline', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login')
  } else {
    next();
  }
})

configRoutes(app);

const port = process.argv[2] || 3000;

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
