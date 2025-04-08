import uploadService from '../services/upload.service.js';
import FileService from '../services/fileService.js'; // Importe le service pour gérer les fichiers dans DynamoDB

/**
 * Controller for file upload
 */
const uploadController = {
    /**
     * Upload file
     * @param {import('express').Request} req - request object
     * @param {import('express').Response} res - response object
     */
    uploadFile: async (req, res) => {
        const file = req.file;
        console.log('Fichier reçu :', req.user);

        try {
            // Upload du fichier (dans un système de fichiers ou S3 par exemple)
            const serviceResponse = await uploadService.uploadFile(file.originalname, file.buffer);

            // Sauvegarde des informations dans la base de données DynamoDB
            const fileData = {
                name: file.originalname,
                path: `http://localhost:4566/${process.env.S3_BUCKET}/${file.originalname}`, 
                // Peut-être a modifier en fonction de l'implementation
                // en production utiliser: https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${file.originalname}
                type: file.mimetype,
                userId: req.user.userId, // Assure-toi que l'ID utilisateur est disponible dans la requête
            };

            // Enregistre les métadonnées dans DynamoDB
            await FileService.saveFileMetadata(fileData);

            res.status(200).send({ message: 'Fichier téléchargé et enregistré avec succès !', data: serviceResponse });
        } catch (error) {
            res.status(500).send({ message: 'Erreur lors du téléchargement ou de l’enregistrement du fichier', error: error.message });
        }
    },

    /**
     * Download file
     * @param {import('express').Request} req - request object
     * @param {import('express').Response} res - response object
     */
    downloadFile: async (req, res) => {
        const { fileName } = req.params;

        try {
            const data = await uploadService.getFile(fileName);
            data.pipe(res);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    /**
     * Delete file
     * @param {import('express').Request} req - request object
     * @param {import('express').Response} res - response object
     */
    deleteFile: async (req, res) => {
        const { fileName } = req.params;
        console.log(fileName);

        try {
            const serviceResponse = await uploadService.deleteFile(fileName);

            // Supprime aussi les métadonnées du fichier dans DynamoDB
            await FileService.deleteFileMetadata(fileName);
            console.log('Fichier supprimé :', serviceResponse);
            res.status(204).send(serviceResponse);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    /**
     * Get all files
     * @param {import('express').Response} res - response object
     */
    getFiles: async (_req, res) => {
        try {
            const data = await FileService.getAllFiles(); // Récupère les fichiers depuis la base de données
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};

export default uploadController;
