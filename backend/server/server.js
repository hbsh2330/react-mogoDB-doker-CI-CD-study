const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes'); 

// 미들웨어
app.use(cors());
app.use(express.json());

// DB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

// 라우터 연결
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));