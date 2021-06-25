<template>
    <div class="setting-container">
        <el-card class="filter-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb style="display: inline-block;" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>个人设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form :model="user" :rules="rules" ref="ruleForm" size="mini" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="编号" prop="id">
                            <el-input v-model="user.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="user.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="媒体名称" prop="name">
                            <el-input v-model="user.name"></el-input>
                        </el-form-item>
                        <el-form-item label="媒体介绍" prop="intro">
                            <el-input type="textarea" v-model="user.intro"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateUser('ruleForm')" :loading='updateUserLoading'>保存设置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4" :offset="4">
                    <!-- <p class="modity" @click="$refs.file.click()">修改头像</p> -->
                    <label for="file">
                        <el-avatar shape="square" :size="150" fit="cover" style="cursor: pointer;" :src="user.photo"></el-avatar>
                        <p class="modity">点击修改头像</p>
                    </label>
                    <input id="file" type="file" ref="file" @change="fileChange" hidden>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog
            title="修改头像"
            :visible.sync="dialogVisible"
            append-to-body
            width="30%"
            @opened="dialogOpened"
            @closed="dialogClosed"
            >
            <div class="preview-img-wrap">
                <img class="preview-img" ref="preview-img" :src="previewImage" alt="">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePhoto" :loading="updatePhotoLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
            
<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
    name: 'SettingIndex',
    components: {},
    props: {},
    data () {
        return {
            user: {
                id: '',
                mobile: '',
                name: '',
                intro: '',
                email: '',
                photo: ''
            },
            dialogVisible: false,
            previewImage: '',
            cropper: null,
            updatePhotoLoading: false,
            updateUserLoading: false,
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                intro: [
                    { required: true, message: '请填写媒体介绍', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            }
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadUser();
    },
    mounted () {},
    methods: {
        loadUser(){
            getUserProfile().then(res => {
                this.user = res.data.data;
            })
        },
        updateUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.updateUserLoading = true;
                    updateUserProfile(this.user).then(res => {
                        this.updateUserLoading = false;
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        // 发布通知，用户信息已修改
                        globalBus.$emit('update-user', this.user)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        fileChange(){
            // 预览图片
            const file = this.$refs.file
            const BlobData = window.URL.createObjectURL(file.files[0]);
            this.previewImage = BlobData;
            this.dialogVisible = true;
            this.$refs.file.value = '';    // 解决相同文件不触发change的问题
        },
        dialogOpened(){
            const image = this.$refs['preview-img']
            // 第一次初始化裁切器后，裁切器默认不更新
            // 如果需要预览图片发生变化更新裁切器：
            // 1.裁切器.replace方法
            // 2.销毁裁切器，重新初始化
            if(this.cropper){
                this.cropper.replace(this.previewImage);
                return;
            }
            this.cropper = new Cropper(image, {
                viewMode: 1,
                drawMode: 'none',
                aspectRatio: 1,
                cropBoxResizable: false
                // 裁切器比例
                // aspectRatio: 16 / 9,
                // 当移动裁切器时触发
                // crop(event) {
                //     console.log(event.detail.x)
                //     console.log(event.detail.y)
                //     console.log(event.detail.width)
                //     console.log(event.detail.height)
                //     console.log(event.detail.rotate)
                //     console.log(event.detail.scaleX)
                //     console.log(event.detail.scaleY)
                // }
            })
        },
        dialogClosed(){
            // 对话框关闭，销毁裁切器
            // this.cropper.destroy();
        },
        updatePhoto(){
            this.updatePhotoLoading = true;
            // 获取裁切的图片对象
            this.cropper.getCroppedCanvas().toBlob(file => {
                const formData = new FormData();
                formData.append('photo', file);
                updateUserPhoto(formData).then(res => {
                    this.dialogVisible = false;
                    this.updatePhotoLoading = false;
                    this.user.photo = window.URL.createObjectURL(file);
                    // this.user.photo = res.data.data.photo;
                    this.$message({
                        type: 'success',
                        message: '更新头像成功'
                    })
                    // 发布通知，用户信息已修改
                    globalBus.$emit('update-user', this.user)
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .modity{
        width: 150px;
        font-size: 14px;
        text-align: center;
        margin: 10px 0 0 0;
        cursor: pointer;
    }
    .preview-img-wrap{
        .preview-img{
            display: block;
            max-width: 100%;
            height: 200px;
        }
    }
</style>