import DynamoService from '../services/dynamoService.js';

export async function saveNewFile(req, res) {
    try {
        const { name, path, type, userId } = req.body;
        const params = {
            TableName: 'Files',
            Item: {
                id: { S: `${Date.now()}` }, 
                name: { S: name },
                path: { S: path },
                type: { S: type },
                userId: { S: userId },
            },
        };
        const result = await DynamoService.putItem(params);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error saving the file' });
    }
}

export async function getAllFiles(req, res) {
    try {
        const params = {
            TableName: 'Files', 
        };
        const data = await DynamoService.getItems(params);
        if (!data) {
            return res.status(404).json({ error: 'Files not found' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving files' });
    }
}

export async function getFileById(req, res) {
    try {
        const { id } = req.params;
        const params = {
            TableName: 'Files',
            Key: {
                id: { S: id },
            },
        };
        const file = await DynamoService.getItem(params);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving the file' });
    }
}

export async function updateFile(req, res) {
    try {
        const { id } = req.params;
        const { name, path, type, userId } = req.body;
        if (!name || !path || !type || !userId) {
            return res.status(400).json({ error: 'Missing required fields: name, path, type, or userId' });
        }
        const params = {
            TableName: 'Files',
            Key: {
                id: { S: id },
            },
            UpdateExpression: 'SET #name = :name, #path = :path, #type = :type, #userId = :userId',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#path': 'path',
                '#type': 'type',
                '#userId': 'userId',
            },
            ExpressionAttributeValues: {
                ':name': { S: name },
                ':path': { S: path },
                ':type': { S: type },
                ':userId': { S: userId },
            },
            ReturnValues: 'ALL_NEW',
        };
        const updatedFile = await DynamoService.updateItem(params);
        if (!updatedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json(updatedFile);
    } catch (error) {
        res.status(500).json({ error: 'Error updating the file' });
    }
}

export async function deleteFile(req, res) {
    try {
        const { id } = req.params;
        const params = {
            TableName: 'Files',
            Key: {
                id: { S: id },
            },
        };
        const deletedFile = await DynamoService.deleteItem(params);
        if (!deletedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json({ message: 'File deleted successfully', deletedFile });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting the file' });
    }
}
