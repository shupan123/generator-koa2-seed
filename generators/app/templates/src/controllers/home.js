import {homeParams} from '../api/index';

export default {
    async index(ctx, next) {

        const {request} = ctx;
        const query = request.query;

        await ctx.render('index', homeParams);

    }
}
