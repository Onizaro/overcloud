#!/bin/bash

# Configuration des variables d’environnement AWS pour LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566

# Créer une table DynamoDB dans LocalStack
aws dynamodb create-table \
    --table-name MaTableTest \
    --attribute-definitions AttributeName=ID,AttributeType=S \
    --key-schema AttributeName=ID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url=$AWS_ENDPOINT_URL

# Vérifier que la table a bien été créée
aws dynamodb list-tables --endpoint-url=$AWS_ENDPOINT_URL

