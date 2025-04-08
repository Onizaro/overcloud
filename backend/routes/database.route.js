import express from 'express';
import databaseController from '../controllers/database.controller.js';

const router = express.Router();

router.post('/register', databaseController.registerUser);
router.post('/login', databaseController.loginUser);
router.put('/update', databaseController.updateUser);
router.delete('/:email', async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Pass only the email to the controller
        const response = await databaseController.deleteUser({ email });

        return res.status(200).json(response);
    } catch (error) {
        console.error(`Error during user deletion: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
});


export default router;