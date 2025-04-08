import DynamoService from './dynamoService.js';

export default class FileService {
  static async saveFileMetadata(fileData) {
    const params = {
      TableName: 'Files',
      Item: {
        id: { S: `${Date.now()}` }, 
        name: { S: fileData.name },
        path: { S: fileData.path },
        type: { S: fileData.type },
        userId: { S: fileData.userId },
      },
    };
    return await DynamoService.putItem(params); // Enregistre le fichier dans DynamoDB
  }

  static async getAllFiles() {
    const params = {
      TableName: 'Files',
    };
    return await DynamoService.getItems(params); // Récupère les fichiers depuis DynamoDB
  }

  static async deleteFileMetadata(id) {  // Changer fileName en id
    const params = {
      TableName: 'Files',
      Key: {
        id: { S: id },  // Utiliser id ici
      },
    };
    return await DynamoService.deleteItem(params); // Supprime le fichier dans DynamoDB
}

}
