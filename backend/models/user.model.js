import AWS from 'aws-sdk';

// Configure DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'eu-west-3', 
});

// Table name
const TABLE_NAME = 'Users';

// Create a user
export const createUser = async (user) => {
    const params = {
        TableName: TABLE_NAME,
        Item: user,
    };
    return dynamoDB.put(params).promise();
};

// Get a user by email
export const getUserByEmail = async (email) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { email },
    };
    const result = await dynamoDB.get(params).promise();
    return result.Item;
};

// Update a user
export const updateUser = async (email, updates) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { email },
        UpdateExpression: 'set #attr = :value',
        ExpressionAttributeNames: { '#attr': Object.keys(updates)[0] },
        ExpressionAttributeValues: { ':value': Object.values(updates)[0] },
        ReturnValues: 'UPDATED_NEW',
    };
    return dynamoDB.update(params).promise();
};