import { 
    S3Client, 
    HeadBucketCommand, 
    CreateBucketCommand 
} from "@aws-sdk/client-s3";

const localStackEndpoint = 'http://localstack:4566';

const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: localStackEndpoint,
    forcePathStyle: true,
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
});

const bucketName = 'file-storage';

const retries = 5;

let retriesCountdown = retries;
let error;

const createBucketIfNotExists = async (bucketName) => {
    const params = {
        Bucket: bucketName,
    };

    try {
        const command = new HeadBucketCommand(params);
        await s3.send(command);
        console.log(`Bucket ${bucketName} already exists`);
    } catch (err) {
        if (err.name === "NotFound") {
            await createBucket(bucketName);
        } else {
            error = err;
        }
    }
};

const createBucket = async (bucketName) => {
    const params = {
        Bucket: bucketName,
    };

    try {
        const command = new CreateBucketCommand(params);
        await s3.send(command);
        console.log(`Bucket ${bucketName} created successfully`);
    } catch (err) {
        throw new Error(`Error creating bucket: ${err.message}`);
    }
};

while (retriesCountdown > 0) {
    try {
        await createBucketIfNotExists(bucketName);
        break;
    } catch (err) {
        error = err;
        const delay = Math.pow(2, retries - retriesCountdown) * 500; // 500ms, 1000ms, 2000ms
        console.error(`Bucket creation failed: ${error.message}.
            Retrying in ${delay} ms... Retries left: ${retriesCountdown - 1}`);
        retriesCountdown--;
        await new Promise(resolve => setTimeout(resolve, delay)); 
    }
}
if (retriesCountdown === 0) {
    throw new Error(`Failed to create bucket: ${error.message}`);
}

export { s3, bucketName };