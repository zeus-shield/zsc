import NotFound from './views/404.vue'
import Index from './views/index.vue'
import myinsura from './views/myinsura_myinsura.vue'
import myinsuraMine from './views/myinsura_mine.vue'
import myinsuraLogin from './views/myinsura_login.vue'

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
        path: '/myinsura',
        name:'myinsura',
        component: myinsura,
    },
    {
        path: '/mine',
        name:'mine',
        component: myinsuraMine,
    },
    {
        path: '/',
        name:'index',
        component: Index,
    },
];

export default routes;