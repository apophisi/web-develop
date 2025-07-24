import app from './app';
import connectDB from './config/config';
import env from './config/env';

const startServer = async () => {
    await connectDB();

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
};

startServer().catch(err => {
    console.error('Server startup error:', err);
    process.exit(1);
});