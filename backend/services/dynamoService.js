import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, DescribeTableCommand, CreateTableCommand,  ScanCommand } from '@aws-sdk/client-dynamodb';

const localStackEndpoint = 'http://localstack:4566';

const dynamoDb = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: localStackEndpoint,
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
});

const DynamoService = {
    getItem: async (params) => {
        try {
            // Ensure the table exists
            await DynamoService.ensureTableExists(params.TableName);

            const command = new GetItemCommand(params);
            const data = await dynamoDb.send(command);
            return data.Item;
        } catch (error) {
            console.error('Error getting item from DynamoDB', error);
            throw new Error('Error getting item from DynamoDB');
        }
    },

    getItems: async (params) => {
        try {
            await DynamoService.ensureTableExists(params.TableName);

            const command = new ScanCommand(params);
            const data = await dynamoDb.send(command);
            return data.Items || [];
        } catch (error) {
            console.error('Error scanning table in DynamoDB', error);
            throw new Error('Error scanning table in DynamoDB');
        }
    },

    putItem: async (params) => {
        try {
            // Ensure the table exists
            await DynamoService.ensureTableExists(params.TableName);

            const command = new PutItemCommand(params);
            await dynamoDb.send(command);
            return { success: true };
        } catch (error) {
            console.error('Error putting item to DynamoDB', error);
            throw new Error('Error putting item to DynamoDB');
        }
    },

    updateItem: async (params) => {
        try {
            // Ensure the table exists
            await DynamoService.ensureTableExists(params.TableName);

            const command = new UpdateItemCommand(params);
            const result = await dynamoDb.send(command);
            return result.Attributes;
        } catch (error) {
            console.error('Error updating item in DynamoDB', error);
            throw new Error('Error updating item in DynamoDB');
        }
    },

    deleteItem: async (params) => {
        try {
            // Ensure the table exists
            await DynamoService.ensureTableExists(params.TableName);

            const command = new DeleteItemCommand(params);
            await dynamoDb.send(command);
            return { success: true };
        } catch (error) {
            console.error('Error deleting item from DynamoDB', error);
            throw new Error('Error deleting item from DynamoDB');
        }
    },

    ensureTableExists: async (tableName) => {
        try {
            // Check if the table exists
            const describeCommand = new DescribeTableCommand({ TableName: tableName });
            await dynamoDb.send(describeCommand);
            console.log(`Table '${tableName}' exists.`);
        } catch (error) {
            if (error.name === 'ResourceNotFoundException') {
                // Table does not exist, create it
                console.log(`Table '${tableName}' not found. Creating table...`);
                await DynamoService.createTable(tableName);
            } else {
                throw new Error('Error describing the table: ' + error.message);
            }
        }
    },

    createTable: async (tableName) => {
        try {
            const createCommand = new CreateTableCommand({
                TableName: tableName,
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' },
                ],
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
            });
            await dynamoDb.send(createCommand);
            console.log(`Table '${tableName}' created successfully.`);
        } catch (error) {
            console.error('Error creating table:', error);
            throw new Error('Error creating table: ' + error.message);
        }
    }
};

export default DynamoService;
