<template>
    <div class="login-container">
        <div class="head">
            <div class="login-head"></div>
            <el-form class="login-form" :rules="formRules" ref="user" :model="user" size="mini">
                <el-form-item prop="mobile">
                    <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item prop="agree">
                    <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loginLoading" class="login-btn" type="primary" @click="onLogin('user')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user'
export default {
    name: 'LoginIndex',
    data(){
        return {
            user: {
                mobile: '',
                code: '',
                agree: false
            },
            loginLoading: false,
            formRules: {
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'change' },
                    { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'change' },
                    { pattern: /^\d{6}$/, message: '请输入正确的验证码'}
                ],
                agree: [
                    { 
                        // 自定义校验规则
                        validator: (rule, value, callback) => {
                            if(value){
                                callback();
                            }else{
                                callback(new Error('请勾选同意用户协议'));
                            }
                        },
                        trigger: 'change' 
                    }
                ]
            }
        }
    },
    methods: {
        onLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const user = this.user;
                    this.loginLoading = true;
                    login(this.user).then(res => {
                        this.loginLoading = false;
                        this.$message({
                            message: '登录成功',
                            type: 'success'
                        });
                        window.localStorage.setItem('user',JSON.stringify(res.data.data))
                        this.$router.push({
                            name: 'home'
                        })
                    }).catch(err => {
                        this.loginLoading = false;
                        this.$message.error('手机号或验证码有误');
                    })
                } else {
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.login-container{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background:url('../../assets/images/login_bg.jpg') no-repeat;
    background-size: cover;
    .head{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #fff;
        .login-head{
            margin-top: 20px;
            height: 57px;
            width: 260px;
            background: url('../../assets/images/logo_index.png') no-repeat;
        }
        .login-form{
            padding: 30px 50px;
            min-width: 200px;
            .login-btn{
                width: 100%;
            }
        }
    }
}
</style>