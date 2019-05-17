import NotFound from './views/404.vue'
import Index from './views/index.vue'
import myinsura from './views/myinsura_myinsura.vue'

let routes = [
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: '/'
    },
    {
        path: '/',
        name:'index',
        component: Index,
    },
];

export default routes;