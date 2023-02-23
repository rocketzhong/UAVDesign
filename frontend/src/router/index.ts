import { createRouter, createWebHashHistory } from 'vue-router';
import status from '../pages/status.vue'
import setting from '../pages/setting.vue'
const routes = [
    { path: '/', redirect: '/status' },
    { path: '/status', component: status },
    { path: '/setting', component: setting }
]
export default createRouter({
    history: createWebHashHistory(),
    routes
});