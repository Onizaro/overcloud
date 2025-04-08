import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { createUser, getUserById } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const sendEmailWithCode = (email, code) => {
    // Implémentation de l'envoi d'email
};

export async function createUser(req, res) {
    const { email, password, firstname, lastname, twoFactorFrequency = 'always' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const newUser = {
        id: new Date().toISOString(),
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname,
        verificationCode: verificationCode,
        codeExpiration: Date.now() + 10 * 60 * 1000,
        twoFactorFrequency: twoFactorFrequency,
        lastTwoFactorSuccess: Date.now(),
        token: null,
        status: 'alive',
        lastConnection: Date.now(),
    };

    try {
        await createUser(newUser);
        await sendEmailWithCode(email, verificationCode);
        res.status(201).json({ message: 'Utilisateur créé et e-mail envoyé' });
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export async function getUser(req, res) {
    const { id } = req.params;
    try {
        const person = await getUserById(id);
        if (person) {
            res.status(200).json(person);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Implémentation similaire pour loginUser, logoutUser, etc.
