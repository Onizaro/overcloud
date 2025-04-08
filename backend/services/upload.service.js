import { 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand, 
    ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { s3, bucketName } from '../cloud-setup/bucket.setup.js';

/**
 * Upload file to S3 bucket
 */
const uploadService = {
    uploadFile:  async (id, fileContent) => {
        const params = {
            Bucket: bucketName,
            Key: id,  // Utiliser id pour le nom du fichier
            Body: fileContent,
        };

        try {
            const command = new PutObjectCommand(params);
            const response = await s3.send(command);
            return response;
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    },

    getFile: async (id) => {
        const params = {
            Bucket: bucketName,
            Key: id,  // Utiliser id pour le nom du fichier
        };

        try {
            const command = new GetObjectCommand(params);
            const data = await s3.send(command);
            return data.Body;
        } catch (error) {
            throw new Error(`File retrieval failed: ${error.message}`);
        }
    },

    deleteFile: async (id) => {  // Changer fileName en id
        const params = {
            Bucket: bucketName,
            Key: id,  // Utiliser id
        };

        try {
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            return `File ${id} deleted successfully`;  // Utiliser id
        } catch (error) {
            throw new Error(`File deletion failed: ${error.message}`);
        }
    },

    getFiles: async () => {
        const params = {
            Bucket: bucketName,
        };

        try {
            const command = new ListObjectsCommand(params);
            const data = await s3.send(command);
            return data.Contents;
        } catch (error) {
            throw new Error(`File retrieval failed: ${error.message}`);
        }
    },
};

export default uploadService;
