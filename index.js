import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import testRoutes from './src/routes/testRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import auditRoutes from './src/routes/auditRoutes.js'
import projectRoutes from './src/routes/projectRoutes.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/', testRoutes);
app.use('/api/task/', taskRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/audit/', auditRoutes);
app.use('/api/project/', projectRoutes);

// GLOBAL error handling
app.use((err, req, res, next)=>{
    res.status(500).json({
        message: err.message
    })
})

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log('Server running on PORT', port);
    });
};

startServer();