import express from 'express';
import uploadController from '../controllers/upload.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file === undefined) {
        return res.status(400).send('A file is required.');
    }
    uploadController.uploadFile(req, res);
});
router.get('/upload/:fileName', uploadController.downloadFile);
router.delete('/upload/:fileName', uploadController.deleteFile);
router.get('/uploads', uploadController.getFiles);

export default router;
