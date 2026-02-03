require('dotenv').config({ path: './.env' });
// Set DNS servers early to fix MongoDB SRV connection issues
const dns = require('dns');
dns.setServers([
  "8.8.8.8",      // Google DNS
  "8.8.4.4",      // Google DNS secondary
  "1.1.1.1",      // Cloudflare DNS
  "1.0.0.1"       // Cloudflare DNS secondary
]);

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');


const indexRouter = require('./routes/index.routes');


require("./utils/config.db")();
require("./utils/admin.autoregister").AdminRegisterAuto();


// ✅ NEW CRONS - Only 2 types of ROI

// 2. Trading ROI - Distributed at 5:30 AM daily to users who activated AI trade
require("./cron/trading.roi.cron");
// 3. ROI Dividend - Distributed at 5:30 AM daily based on downline ROI
require("./cron/roiDividend.cron");

const app = express();

// Security headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https:'],
    styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https:'],
    frameAncestors: ["'none'"],
  }
}));


// CORS Configuration - Fixed for production with credentials
const allowedOrigins = [
  // 'https://zeptodefi.io',             
  // 'https://www.zeptodefi.io',
  "https://zeptdefi.io",       
  'http://localhost:1437',
  'http://localhost:1438',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
}));

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET environment variable is required. Please add it to your .env file.');
  process.exit(1);
}

app.use(session({
  name: "ico",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    maxAge: 1 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // 'none' for cross-site in production
  },
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    autoRemove: 'disabled'
  })
}));

app.use('/api', indexRouter);

// Handle preflight requests
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Only force JSON responses for API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log("Server is running on port " + process.env.PORT);

module.exports = app;
