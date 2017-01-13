import AWS from 'aws-sdk';
import {
    countParams,
    describeTableParams,
    createTableParams,
    removeTableParams,
    itemParams,
    batchParams,
    listParams,
    updateParams,
    removeParams
} from '../api/index';
import {wrap} from '../utils/index';

AWS.config.update({
    region: 'us-west-2'
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

let snackCollection = [];

export default {
    async index(ctx, next) {
        const message = 'Hello AWS';

        await ctx.render('aws', {message});
    },
    async createTable(ctx, next) {
        const message = 'Create table success.';
        await wrap(dynamodb, dynamodb.createTable, createTableParams);

        console.log(message);

        await ctx.render('aws', {message});

    },
    async removeTable(ctx, next) {
        const message = 'Remove table success.';
        await wrap(dynamodb, dynamodb.deleteTable, removeTableParams);

        console.log(message);

        await ctx.render('aws', {message});
    },
    async add(ctx, next) {
        const message = 'Add item success.';
        await wrap(docClient, docClient.put, itemParams());

        console.log(message);

        await ctx.render('aws', {message});
    },
    async batch(ctx, next) {
        const message = 'Batch create success.';
        await wrap(docClient, docClient.batchWrite, batchParams());

        console.log(message);

        await ctx.render('aws', {message});
    },
    async list(ctx, next) {
        const message = 'List items success.';
        const page = parseInt(ctx.params.page) || 1;
        const snackLength = snackCollection.length;

        let first = page === 1 ? true : false;
        let last = false;

        if (snackLength > 0 && page > 1) {
            listParams.ExclusiveStartKey = snackCollection[ page - 2];
        } else {
            listParams.ExclusiveStartKey = undefined;
        }

        let snacks = await wrap(docClient, docClient.query, listParams);

        const lastKey = snacks.LastEvaluatedKey;

        if (typeof lastKey !== 'undefined') {
            snackCollection.push(lastKey);
        } else {
            last = true;
        }

        let items = await wrap(docClient, docClient.scan, countParams);

        /*snacks.Items = snacks.Items.sort((a, b) => {
            return a.Count < b.Count;
        });*/

        await ctx.render('aws', {
            snacks,
            items,
            message,
            page,
            snackLength,
            first,
            last
        });

    },
    async update(ctx, next) {
        const message = 'Update item success.'
        const {id, name} = ctx.params;
        await wrap(docClient, docClient.update, updateParams(id, name));

        console.log(message);

        await ctx.render('aws', {message});
    },
    async remove(ctx, next) {
        const message = 'Remove item success.'
        const {id, name} = ctx.params;
        await wrap(docClient, docClient.delete, removeParams(id, name));

        console.log(message);

        await ctx.render('aws', {message});
    }
}
