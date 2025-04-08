import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient(
  { 
    region: "us-east-1", 
    endpoint: "http://localstack:4566", // Utilisation de LocalStack pour tests locaux
    credentials: {
      accessKeyId: "dummy", 
      secretAccessKey: "dummy",
    }
  });

async function createUsersTable() {
  const params = {
    TableName: "Users",
    AttributeDefinitions: [
      { AttributeName: "email", AttributeType: "S" },  // "S" pour String
    ],
    KeySchema: [
      { AttributeName: "email", KeyType: "HASH" },  // Clé de partition (HASH)
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    }
  };

  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDBClient.send(command);
    console.log("Table created successfully:", result);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

async function createTableWithRetries() {
  const retries = 5;
  let retriesCountdown = retries;

  while (retriesCountdown > 0) {
    try {
      await createUsersTable();
      break;
    } catch (err) {
      const delay = Math.pow(2, retries - retriesCountdown) * 500; // Exponential backoff: 500ms, 1000ms, 2000ms
      console.log(`Table creation failed: ${err.message}. Retrying in ${delay} ms... Retries left: ${retriesCountdown - 1}`);
      retriesCountdown--;
      await new Promise(resolve => setTimeout(resolve, delay)); // Attente avant de réessayer
    }
  }
}

await createTableWithRetries();
export { dynamoDBClient };
