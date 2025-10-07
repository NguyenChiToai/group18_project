// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// 1. IMPORT USER ROUTES
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware này rất quan trọng để đọc được req.body

app.get('/', (req, res) => res.send('API is running...'));

// 2. SỬ DỤNG USER ROUTES
// Bất kỳ request nào tới '/api/users' sẽ được chuyển cho userRoutes xử lý
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));