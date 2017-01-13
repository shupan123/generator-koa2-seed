import uuid from 'uuid';
const pkg = require('../../package.json');

const table = 'Shupan-Snacks';
const index = 'Placeholder-Count-index';

export const homeParams = pkg;

export const createTableParams = {
    TableName: table,
    KeySchema: [
        {AttributeName: 'SnackId', KeyType: 'HASH'},
        {AttributeName: 'SnackName', KeyType: 'RANGE'}
    ],
    AttributeDefinitions: [
        {AttributeName: 'SnackId', AttributeType: 'S'},
        {AttributeName: 'SnackName', AttributeType: 'S'},
        {AttributeName: 'Placeholder', AttributeType: 'N'},
        {AttributeName: 'Count', AttributeType: 'N'}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: index,
            KeySchema: [
                {AttributeName: 'Placeholder', KeyType: 'HASH'},
                {AttributeName: 'Count', KeyType: 'RANGE'}
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ]
};

export const removeTableParams = {
    TableName: table
};

export const itemParams = () => ({
    TableName: table,
    Item: {
        'SnackId': uuid.v1(),
        'SnackName': '雪碧',
        'Count': 40,
        'Picture': new Buffer('aabbccddee'),
        'Price': 1,
        'SellTime': new Date().toString(),
        'Storage': [
            '冷藏', '常温'
        ],
        'Placeholder': 1
    }
});

export const batchParams = () => ({
    RequestItems: {
        [table]: [
            {
                PutRequest: {
                    Item: {
                        'SnackId': uuid.v1(),
                        'SnackName': '可乐',
                        'Count': 30,
                        'Picture': new Buffer('1122334455'),
                        'Price': 1,
                        'SellTime': new Date().toString(),
                        'Storage': ['冷藏', '常温'],
                        'Placeholder': 1
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        'SnackId': uuid.v1(),
                        'SnackName': '果汁',
                        'Count': 20,
                        'Picture': new Buffer('aabbccdd'),
                        'Price': 2,
                        'SellTime': new Date().toString(),
                        'Storage': ['冷藏', '常温'],
                        'Placeholder': 1
                    }
                }
            }
        ]
    }
});

export const listParams = {
    TableName: table,
    IndexName: index,
    ProjectionExpression: 'SnackId, SnackName, #count, #storage',
    KeyConditionExpression: 'Placeholder = :placeholder and #count > :count',
    ExpressionAttributeNames: {
        '#count': 'Count',
        '#storage': 'Storage'
    },
    ExpressionAttributeValues: {
        ':placeholder': 1,
        ':count': 0
    },
    Limit: 3,
    ScanIndexForward: false //排序方式
};

export const countParams = {
    TableName: table,
    ProjectionExpression: 'SnackId'
};

export const updateParams = (id, name) => ({
    TableName: table,
    Key: {
        'SnackId': id,
        'SnackName': name
    },
    UpdateExpression: 'set #count = :count, #storage = :storage',
    ExpressionAttributeNames: {
        '#count': 'Count',
        '#storage': 'Storage'
    },
    ExpressionAttributeValues: {
        ':count': 10,
        ':storage': ['常温']
    },
    ReturnValues: 'UPDATED_NEW'
});

export const removeParams = (id, name) => ({
    TableName: table,
    Key: {
        'SnackId': id,
        'SnackName': name
    },
    ConditionExpression: 'SnackId = :val',
    ExpressionAttributeValues: {
        ':val': id
    }
});
