const path = require('path');
const fs = require('fs')
require('dotenv').config();
const mongoose = require('mongoose');


const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')


const signupRoutes = require('./routes/signupRoutes')
 const ExpenseRoutes = require('./routes/ExpenseRoutes')
 const PurchaseRoutes = require('./routes/purchaseRoutes')
 const PremiumFeaturesRoutes = require('./routes/premiumFeaturesRoutes')
 const resetPasswordRoutes = require('./routes/forgotformRoutes')

var cors = require('cors');
const { truncate } = require('fs/promises');

const app = express()

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
)

app.use(cors());
app.use(helmet())
app.use(compression())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

 app.use(PremiumFeaturesRoutes)
 app.use(PurchaseRoutes)
 app.use(resetPasswordRoutes);
 app.use(ExpenseRoutes)
app.use(signupRoutes)



mongoose.connect(process.env.MONGODB_CONNECTION)
.then((result)=>{
  console.log('connected')
  app.listen(3000)
})
.catch((err)=>{
  console.log(err)
})






