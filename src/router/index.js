import Vue from 'vue';
import Router from 'vue-router';
import Login from 'components/login/login.vue';
import Home from 'components/home/home.vue';
import Main from 'components/main/main.vue';
import Table from 'components/navi/navi1/Table.vue';
import UserList from 'components/user/list.vue';
import UserAdd from 'components/user/add.vue';
import UserEdit from 'components/user/edit.vue';

Vue.use(Router);

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    meta: { 'text': '登录' }
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta: { 'text': '主页' },
    iconCls: 'el-icon-message', // 图标样式class
    children: [
      { path: '/main', component: Main, name: 'Main', meta: { 'text': '主页' } },
      { path: '/table', component: Table, name: 'Table', meta: { 'text': '表格' } },
      { path: '/user/list', component: UserList, name: 'UserList', meta: { 'text': '用户管理' } },
      { path: '/user/add', component: UserAdd, name: 'UserAdd', meta: { 'text': '新增用户' } },
      { path: '/user/edit/:id', component: UserEdit, name: 'UserEdit', meta: { 'text': '修改用户' } }
    ]
  }
];

export default new Router({
  routes
});
