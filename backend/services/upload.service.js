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

    /**
     * Upload file to S3 bucket
     * @param {string} fileName - name of the file to be uploaded
     * @param {Buffer} fileContent - content of the file to be uploaded
     * @returns response from S3
     */
    uploadFile:  async (fileName, fileContent) => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
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

    /**
     * Get file from S3 bucket
     * @param {string} fileName - name of the file to be retrieved
     * @returns content of the file
     */
    getFile: async (fileName) => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
        };

        try {
            const command = new GetObjectCommand(params);
            const data = await s3.send(command);
            return data.Body;
        } catch (error) {
            throw new Error(`File retrieval failed: ${error.message}`);
        }
    },

    /**
     * Delete file from S3 bucket
     * @param {string} fileName - name of the file to be deleted
     * @returns response from S3
     */
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


    /**
     * Get all files from S3 bucket
     * @returns - list of files in the bucket
     */
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
