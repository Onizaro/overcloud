import uploadService from '../services/upload.service.js';

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

        try {
            const serviceResponse = await uploadService.uploadFile(file.originalname, file.buffer);
            res.status(200).send(serviceResponse);
        } catch (error) {
            res.status(500).send(error.message);
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

        try {
            const serviceResponse = await uploadService.deleteFile(fileName);
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
            const data = await uploadService.getFiles();
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};

export default uploadController;
