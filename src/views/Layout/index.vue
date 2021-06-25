<template>
    <div class="layout-container">
        <el-container style="height:100%;">
            <el-aside class="aside" width="auto">
                <Aside class="aside-menu"></Aside>
            </el-aside>
            <el-container>
                <el-header class="header">
                    <div>
                        <i :class="{'el-icon-s-fold': isCollapse, 'el-icon-s-unfold': !isCollapse}" @click="collapseMenu"></i>
                        <span style="margin-left:10px;">江苏传智播客科技教育有限公司</span>
                    </div>
                    <el-dropdown>
                        <div class="avart">
                            <img class="avt-img" :src="user.photo" alt="">
                            <span>{{user.name}}</span>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="toSetting">个人设置</el-dropdown-item>
                            <el-dropdown-item @click.native="loginOut">用户退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main class="main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
            
<script>
import Aside from './components/Aside.vue'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'
export default {
    name: 'LayoutIndex',
    components: {
        Aside
    },
    props: {},
    data () {
        return {
            user: ''
        }
    },
    computed: {
        isCollapse(){
            return this.$store.state.isCollapse
        }
    },
    watch: {},
    created () {
        this.loadUserProfile();
        // 注册自定义事件，当事件发布后，这个注册函数会被调用
        globalBus.$on('update-user', (data) => {
            this.user.name = data.name;
            this.user.photo = data.photo;
        })
    },
    mounted () {},
    methods: {
        loadUserProfile(){
            getUserProfile().then(res => {
                this.user = res.data.data;
            })
        },
        collapseMenu(){
            this.$store.commit('CollapseMenu')
        },
        toSetting(){
            this.$router.push('/setting');
        },
        loginOut(){
            this.$confirm('确认退出吗?', '退出提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                window.localStorage.removeItem('user');
                this.$router.push('/login')
            }).catch(() => {
                       
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .layout-container{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .aside{
        background: #d3dce6;
        overflow: hidden;
        .aside-menu{
            height: 100%;
        }
    }
    .header{
        background: #fff;
        line-height: 60px;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        .avart{
            display: flex;
            justify-content: center;
            align-items: center;
            .avt-img{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                margin-right: 10px;
            }
        }
    }
</style>