require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const helmet = require("helmet");
const expressLayouts = require("express-ejs-layouts");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("\x1b[43m    Connected to database...     \x1b[0m"));

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, 
});

const loginLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Zwiększono limit prób
  message: "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za 15 minut.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map(origin => origin.trim());

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || origin === 'null') return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error("\x1b[41m CORS REJECTED: \x1b[0m", origin);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(helmet({
  contentSecurityPolicy: false, // Potrzebne dla obrazków z zewnętrznych źródeł
}));

app.use(limiter);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_for_development_only",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.default.create({
      mongoUrl: process.env.DATABASE_URL,
    }),
    cookie: {
      httpOnly: true, // Chroni przed XSS
      secure: false, // Ustaw true tylko gdy używasz HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 // 24 godziny
    }
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  res.locals.user = req.session.user; // Dodajemy informację o użytkowniku
  delete req.session.message;
  next();
});

app.set("view engine", "ejs");

const posts = require("./routes/blog");
app.use("/api/posts", posts);

const frontpage = require("./routes/frontpage");
app.use("/api/frontpage", frontpage);

const pages = require("./routes/pages");
app.use("/api/pages", pages);

const properties = require("./routes/properties");
app.use("/api/properties", properties);
app.use("/properties", properties);

const cms = require("./routes/cms");
app.use("/", cms);

const login = require("./routes/login");
app.use("/login", loginLimiter, login);

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).render("404", {
    path: req.url,
    title: "404 - Strona nie znaleziona"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("\x1b[41m SERVER ERROR: \x1b[0m", err.stack);
  if (!res.headersSent) {
    res.status(500).json({ message: "Wystąpił błąd serwera. Sprawdź logi konsoli." });
  }
});

app.listen(PORT, () =>
  console.log(
    `\x1b[42m Server is running on port: ${PORT} \x1b[0m \n\x1b[41m     http://localhost:${PORT}/      \x1b[0m`
  )
);