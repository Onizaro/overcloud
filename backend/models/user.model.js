import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_USERS;

export const getUserById = async (userId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: userId },
    };
    try {
        const { Item } = await dynamoDB.get(params).promise();
        return Item;
    } catch (error) {
        console.error("DynamoDB error:", error);
        throw new Error("Unable to fetch user");
    }
};

export const createUser = async (userData) => {
    const params = {
        TableName: TABLE_NAME,
        Item: userData,
    };
    try {
        await dynamoDB.put(params).promise();
        return userData;
    } catch (error) {
        console.error("DynamoDB error:", error);
        throw new Error("Unable to create user");
    }
};

// Ajouter d'autres méthodes selon les besoins (e.g., updateUser, deleteUser)
