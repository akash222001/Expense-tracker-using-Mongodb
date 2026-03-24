const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const connectDB = require('./util/database');
connectDB();


const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const Filesdownloaded = require('./models/filesdownloaded');


var cors = require('cors');

const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

//get config vars
dotenv.config();

app.use(cors());


const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchasepremiumRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword');


const exp = require('constants');



app.use(bodyParser.json({ extended: false }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchasepremiumRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

app.use((req, res) => {
    console.log('urlll', req.url);
    res.sendFile(path.join(__dirname, `/${req.url}`));
})



app.use(errorController.get404);

app.listen(3000, () => console.log(`Server running on port 3000`));


