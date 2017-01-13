import home from '../controllers/home';
import aws from '../controllers/aws';

export default (router) => {
    router.get('/', home.index);
    router.get('/aws', aws.index);
    router.get('/aws/table/create', aws.createTable);
    router.get('/aws/table/remove', aws.removeTable);
    router.get('/aws/add', aws.add);
    router.get('/aws/batch', aws.batch);
    router.get('/aws/list/:page', aws.list);
    router.get('/aws/update/:id/:name', aws.update);
    router.get('/aws/remove/:id/:name', aws.remove);
}
