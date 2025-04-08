import express from "express";

import { saveNewFile, getAllFiles, getFileById, updateFile, deleteFile } from "../controllers/file.controller.js";

const router = express.Router();

router.post('/', saveNewFile);           
router.get('/', getAllFiles);           
router.get('/:id', getFileById);        
router.put('/:id', updateFile);        
router.delete('/:id', deleteFile);   

export default router;