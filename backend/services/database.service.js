import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
//import { v4 as uuidv4 } from "uuid";
import { dynamoDBClient } from '../cloud-setup/database.setup.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const JWT_SECRET = process.env.JWT_KEY;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mac.immobilier.investissement@gmail.com', //ici il faut mettre l'addresse mail gmail 
        pass: 'Nou5V0ulons1vestir!', // ici il faut que tu crées un mot de passe pour application, depuis tes réglages du compte gmail, et pour l'application tu renseignes "Nodemailer"
    },
});

const sendEmailWithCode = (email, code) => {
    const mailOptions = {
        from: '', // ici c'est la même addresse que plus haut 
        to: email,
        subject: 'Votre code de vérification',
        text: `Votre code de vérification est : ${code}`,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Service to interact with DynamoDB
 */
const DynamoService = {
    /**
     * Register a new user in DynamoDB
     * @param {createUser} userDto - user data to be registered
     * @returns - response from DynamoDB
     */
    registerUser: async (userDto) => {
        const requiredFields = ["email", "password",/*"firstname", "lastname","age", "address", "city", "region", "postalCode","country", "idCard", "listOfKinfolks", "documentProvingAddress", "codeExpiration", "phoneNumber"*/];        
        for (const field of requiredFields) {
            if (!userDto[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        //const userId = uuidv4();
        const params = {
            TableName: 'Users',
            Item: {
                //userId: userId,
                email: userDto.email,
                password: hashedPassword,
                /*firstname: userDto.firstname,
                lastname: userDto.lastname,
                age: userDto.age,
                address: userDto.address,
                city: userDto.city,
                region: userDto.region,
                postalCode: userDto.postalCode,
                country: userDto.country,
                idCard: userDto.idCard,
                listOfKinfolks: userDto.listOfKinfolks,
                phoneNumber:userDto.phoneNumber,
                documentProvingAddress: userDto.documentProvingAddress,*/
                verificationCode: verificationCode,
                //codeExpiration: userDto.codeExpiration,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                twofactorfrequency:'always'
            },
        };

        try {
            const params_verifcation = {
                TableName: 'Users',
                Key: {
                    email: userDto.email, // Ensure email is part of the primary key
                },
            };
            const command_verification = new GetCommand(params_verifcation);
            const data = await documentClient.send(command_verification);
            if (data.Item) {
                throw new Error('User already exists');
            }
            //await sendEmailWithCode(userDto.email, verificationCode);
            const command = new PutCommand(params);
            return await documentClient.send(command);
        } catch (error) {
            const errorLog = `Error registering user in DynamoDB: ${error.message}`;
            throw new Error(errorLog);
        }
    },

    /**
     * Login a user in DynamoDB
     * @param {LoginUserDto} userDto - user data to be logged in
     * @returns - response from DynamoDB
     */
    loginUser: async (userDto) => {
        const params = {
            TableName: 'Users',
            Key: {
                email: userDto.email, // Ensure email is part of the primary key
            },
        };
    
        try {
            const command = new GetCommand(params);
            const data = await documentClient.send(command);
    
            if (!data.Item) {
                throw new Error('Invalid email or password');
            }
    
            const isPasswordValid = await bcrypt.compare(userDto.password, data.Item.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Générer un token JWT
            const token = jwt.sign({email: data.Item.email},JWT_SECRET,{expiresIn: '1h'});
    
            return {
                message: 'Authentication successful',
                token,
                user: {
                    email: data.Item.email
                },
            };
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    },

    /**
     * Update a user in DynamoDB
     * @param {UpdateUserDto} userDto - user data to be updated
     * @returns - response from DynamoDB
     */
    updateUser: async (userDto) => {
        let updateExpression = "set updatedAt = :updatedAt";
        let expressionAttributeValues = {
            ":updatedAt": new Date().toISOString(),
        };
    
        for (const key in userDto) {
          if (userDto.hasOwnProperty(key) && key !== 'email' && userDto[key] !== undefined) {
            updateExpression += `, ${key} = :${key}`;
            expressionAttributeValues[`:${key}`] = userDto[key];
          }
        }
    
        const params = {
            TableName: 'Users',
            Key: {
                email: userDto.email,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };
    
        try {
            const command = new UpdateCommand(params);
            const response = await documentClient.send(command);
            return { message: `L'utilisateur ${userDto.email} a bien été mis à jour` };
        } catch (error) {
            throw new Error(`Error updating user in DynamoDB: ${error.message}`);
        }
    },
    deleteUser: async (userDto) => {
        if (!userDto || !userDto.email) {
            throw new Error('Email is missing');
        }
    
        const params = {
            TableName: 'Users',
            Key: { email: userDto.email }, // Utilisation correcte de l'email
        };
    
        try {
            console.log(`Deleting user with email: ${userDto.email}`);
            const command = new DeleteCommand(params);
            await documentClient.send(command);
            return { message: 'User deleted successfully', email: userDto.email };
        } catch (error) {
            throw new Error(`Error deleting user in DynamoDB: ${error.message}`);
        }
    }       
};

export default DynamoService;