import app from './app';
import pool from './config/database';

const PORT = process.env.PORT || 3000;

// Test database connection
pool.query('SELECT 1')
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed', err);
        process.exit(1);
    });