import mongoose from 'mongoose';
import fileModel from './models/file.model.js'; // Adjust the path if needed
import userModel from './models/user.model.js'; // Ensure User model is correctly imported

const seedData = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB.');

        await fileModel.deleteMany({});
        await userModel.deleteMany({});
        console.log('Existing data cleared.');

        // Create test users, 
        // can update the data as needed, 
        // with your own data for example to be able to login with code verification, 
        // correct before pushing to github.
        const users = await userModel.insertMany([
            { name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
        ]);

        console.log('Test users created.');

        const files = await fileModel.insertMany([
            { name: 'Notes for Serena', path: 'https://drive.google.com/file/d/19qkkBKWtOSM8Tk3SyXj-1RI4HB9bm9d3/view?usp=sharing', type: 'notes', userID: users[0]._id },
            { name: 'Last Picture with Serena', path: 'https://drive.google.com/file/d/13l-2RdQPp4oD6Mu5BbuBIhkGMXirNaFs/view?usp=sharing', type: 'image', userID: users[0]._id },
        ]);

        console.log('Test files created.');
        console.log('Seed data successfully populated.');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedData();
