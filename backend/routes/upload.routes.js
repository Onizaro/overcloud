import express from 'express';
import uploadController from '../controllers/upload.controller.js';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload',authenticateToken, upload.single('file'), (req, res) => {
    if (req.file === undefined) {
        return res.status(400).send('A file is required.');
    }
    uploadController.uploadFile(req, res);
});
router.get('/upload/:fileName',authenticateToken, uploadController.downloadFile);
router.delete('/upload/:id',authenticateToken, uploadController.deleteFile);
router.get('/uploads',authenticateToken, uploadController.getFiles);

export default router;
