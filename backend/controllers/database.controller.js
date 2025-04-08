import DynamoService from "../services/database.service.js";
import User from "../models/user.model.js";

const databaseController = {
    registerUser: async (req, res) => {
        const userDto = req.body; // TODO: userDto should be in a valid format

        try {
            const response = await DynamoService.registerUser(req.body);
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: response.userDto
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    loginUser: async (req, res) => {
        const userDto = req.body; // TODO: userDto should be in a valid format

        try {
            const response = await DynamoService.loginUser(userDto);
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    updateUser: async (req, res) => {
        try {
          const userDto = new User(req.body); // Create a User object
    
          const response = await DynamoService.updateUser(userDto);
          res.status(200).json(response);
        } catch (error) {
          res.status(500).json({ message: error.message }); // Send JSON error response
        }
    },
    deleteUser: async (req) => { // No 'res' needed here
        // Use req.email directly since the route is sending an object with email property.
        try {
            const response = await DynamoService.deleteUser(req);  // Pass the object containing the email
            return response; // Return the response for the route handler to send.
        } catch (error) {
            // Re-throw the error to be caught by the route's error handler
            throw error;
        }
    },
};

export default databaseController;