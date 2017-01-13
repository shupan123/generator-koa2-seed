import home from '../api/home';

export default (router) => {
    router.get('/', home.index);
}
