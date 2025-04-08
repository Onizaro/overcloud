import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import user from '../models/user.model.js';
import recipient from '../models/recipient.model.js';
import file from '../models/file.model.js';
import jwt from 'jsonwebtoken'; 
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rathauflomdag@gmail.com', //ici il faut mettre l'addresse mail gmail 
        pass: 'rpwi rbxm qftq nlop ', // ici il faut que tu crées un mot de passe pour application, depuis tes réglages du compte gmail, et pour l'application tu renseignes "Nodemailer"
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


export async function createUser(req, res) {
    const { email, password, firstname, lastname, twoFactorFrequency = 'always',phonenumber,age,address,city,region,postalcode,country,IDcard,listofkinfolks,documentprovingaddress} = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    try {
        const newUser = new user({
            email: email,
            password: hashedPassword,
            firstname: firstname,
            lastname: lastname,
            verificationCode: verificationCode,
            codeExpiration: Date.now() + 10 * 60 * 1000, 
            twoFactorFrequency: twoFactorFrequency, 
            lastTwoFactorSuccess: Date.now(), 
            knownDevices: [],
            phonenumber: phonenumber,
            Age: age,
            address:address,
            city:city,
            region:region,
            postalcode:postalcode,
            country:country,
            IDcard: IDcard,
            listofkinfolks:listofkinfolks,
            documentprovingaddress:documentprovingaddress,
        });
        await newUser.save();

        await sendEmailWithCode(email, verificationCode);

        res.status(201).json({ message: 'Utilisateur créé et e-mail envoyé' });
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


export async function getAllUsers(req, res){
    const users = await user.find();
    res.json(users);
};

export async function getUser(req, res) {
    const { id } = req.params;

    try {
        const person = await user.findOne({ _id: id });

        if (person) {
            res.status(200).json({
                message: 'utilisateur récupéré',
                firstname: person.firstname,
                lastname: person.lastname,
                twoFactorFrequency: person.twoFactorFrequency
            });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé',  twoFactorRequired: true, userId: person._id, twoFactorFrequency: person.twoFactorFrequency });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des préférences :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


export async function loginUser(req, res) {
    try {
        const { email, password, deviceId } = req.body; 
        const person = await user.findOne({ email: email });
        if (person) {
            const isMatch = bcrypt.compareSync(password, person.password);

            if (isMatch && person.status!="deceased") {
                const now = Date.now();
                const needsTwoFactor = (() => {
                    if (person.twoFactorFrequency === 'always') return true;
                    if (person.twoFactorFrequency === 'monthly' && (!person.lastTwoFactorSuccess || now - person.lastTwoFactorSuccess > 30 * 24 * 60 * 60 * 1000)) return true;
                    if (person.twoFactorFrequency === 'newDevice' && (!deviceId || !person.knownDevices.includes(deviceId))) return true;
                    return false;
                })();
                if (needsTwoFactor) {
                    const loginCode = Math.floor(100000 + Math.random() * 900000);
                    person.verificationCode = loginCode;
                    person.codeExpiration = now + 10 * 60 * 1000;
                    await person.save();
                    await sendEmailWithCode(email, loginCode);
                    res.status(200).json({ message: 'Code de vérification envoyé', twoFactorRequired: true, userId: person._id, twoFactorFrequency: person.twoFactorFrequency });
                } else {
                    person.lastConnection = now;
                    if (person.status !== 'alive') person.status = 'alive';
                    person.lastTwoFactorSuccess = now;
                    const token = jwt.sign({ userId: person._id, email: person.email }, JWT_SECRET);
                    person.token = token;
                    await person.save();
                    res.status(200).json({ message: 'Connexion réussie',userId: person._id, twoFactorRequired: false, token: token, email: person.email });
                }
            } else {
                res.status(401).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });
            }
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export async function verifyCode(req, res){
    const { email, code, deviceId } = req.body;
    try {
        const person = await user.findOne({ email: email });
        
        if (person && person.verificationCode === code && Date.now() < person.codeExpiration) {
            const token = jwt.sign({ userId: person._id, email: person.email }, JWT_SECRET);
            person.token = token;
            if (deviceId && !person.knownDevices.includes(deviceId)) {
                person.knownDevices.push(deviceId);
            }
            person.verificationCode = null;
            person.codeExpiration = null;
            person.lastTwoFactorSuccess = Date.now();
            person.lastConnection = Date.now();
            if (person.status !== 'alive') person.status = 'alive';

            await person.save();
            res.status(200).json({ message: 'Vérification réussie', token: token });
        } else {
            res.status(401).json({ message: 'Code invalide ou expiré' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du code :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export async function updateTwoFactorSettings(req, res) {
    const { email, twoFactorFrequency } = req.body;

    try {
        const person = await user.findOne({ email: email });

        if (person) {
            person.twoFactorFrequency = twoFactorFrequency;
            await person.save();
            res.status(200).json({ message: 'Préférences mises à jour' });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des préférences :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export async function logoutUser(req, res) {
    const { email } = req.body;

    try {
        const person = await user.findOne({ email: email });

        if (person) {
            person.token = null; 
            await person.save();
            res.status(200).json({ message: 'Déconnexion réussie' });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

cron.schedule('0 1 * * *', async () => {
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await user.find({ lastConnection: { $lt: sixMonthsAgo }, status: 'alive' });

    for (const user of inactiveUsers) {
        user.status = 'checking';
        await user.save();
        const mailOptions = {
            from: '',
            to: user.email,
            subject: 'Confirmez votre activité',
            text: `Bonjour ${user.firstname}, cela fait longtemps que nous n'avons pas vu d'activité de votre part. Veuillez vous connecter dans les 2 prochains jours pour confirmer que vous êtes toujours actif.`,
        };
        await transporter.sendMail(mailOptions);
    }
});

cron.schedule('0 1 * * *', async () => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;

    try {
        const usersToMarkDeceased = await user.find({
            status: 'checking',
            lastConnection: { $lt: new Date(twoDaysAgo) },
        });
        for (const user of usersToMarkDeceased) {
            user.status = 'deceased';
            await user.save();
            const recipients = await recipient.find({ senderId: user._id});
            const test = await recipient.find();
            for (const recipient of recipients) {
                const data = await file.findById(recipient.fileId);
                const mailOptions = {
                    from: '',
                    to: recipient.email,
                    subject: 'Vos fichiers',
                    text: 'Voici le fichier envoyé automatiquement.',
                    attachments: [
                        {
                            filename: data.name,
                            content: data.path,
                            contentType: data.type,
                        },
                    ],
                };
        
                await transporter.sendMail(mailOptions);
            }
        }
    } catch (error) {
        console.error('Erreur lors du cron job pour les utilisateurs :', error);
    }
});