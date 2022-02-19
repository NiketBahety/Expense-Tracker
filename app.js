const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./utils/db');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

dotenv.config({ path: './config.env' });

connectDB();

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();
app.use(cors({ origin: '*', credentials: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(compression());

// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

app.use('/', viewRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/users', userRoutes);

const port = process.env.PORT || 3000;

app.listen(
  port,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  )
);
