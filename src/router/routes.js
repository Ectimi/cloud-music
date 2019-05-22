import routesComponent from './routesComponent.js'

export default [
    { path: '/login', name: 'Login', component: routesComponent.Login },
    {
        path: '/',
        name: 'Index',
        component: routesComponent.Index,
        redirect: '/discover',
        children: [{
                path: '/discover',
                component: routesComponent.Discover,
                props: true,
                meta: {
                    keepAlive: true, //此组件需要被缓存
                }
            },
            {
                path: '/mine',
                name: 'Mine',
                component: routesComponent.Mine,
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: '/account',
                name: 'Account',
                component: routesComponent.Account
            }
        ]
    },
    { path: '/songlist/:id', name: 'SongList', component: routesComponent.SongList },
    {
        path: '/songlistsquare',
        name: 'SongListSquare',
        component: routesComponent.SongListSquare,
        meta: {
            keepAlive: true,
        }
    },
    {
        path: '/ranking',
        name: 'Ranking',
        component: routesComponent.Ranking
    },
    {
        path: '/similar',
        name: 'Similar',
        component: routesComponent.Similar
    },
    {
        path: '/radio',
        name: 'Radio',
        component: routesComponent.Radio,
    },
    {
        path: '/radiodetail/:id',
        name: 'RadioDetail',
        component: routesComponent.RadioDetail
    },

]