<template>
    <div class="img-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb style="display: inline-block;" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>素材管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div style="margin-bottom: 15px;display: flex;justify-content: space-between;">
                <el-radio-group v-model="collect" @change="collectChange(collect)" size="mini">
                    <el-radio-button :label="false">全部</el-radio-button>
                    <el-radio-button :label="true">收藏</el-radio-button>
                </el-radio-group>
                <el-button type="success" @click="dialogUploadVisible = true" size="mini">添加素材</el-button>
            </div>
            <el-row :gutter="10">
                <el-col class="img-item" :xs="12" :sm="6" :md="6" :lg="4" :xl="4" v-for="(item, index) in imgs" :key="index">
                    <el-image style="height: 100px" :src="item.url" fit="cover"></el-image>
                    <div class="img-action">
                        <el-button type="warning" size="mini" @click="onCollect(item)" :loading="item.loading" :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle></el-button>
                        <el-button type="danger" size="mini" @click="onDelete(item)" :loading="item.loading" icon="el-icon-delete" circle></el-button>
                    </div>
                </el-col>
            </el-row>
            <el-pagination
                class="fy"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                :current-page.sync="currentPage"
                :total="totalNum"
                >
            </el-pagination>
        </el-card>
        <el-dialog title="上传素材" width="30%" :visible.sync="dialogUploadVisible" :append-to-body="true">
            <el-upload
                v-if="dialogUploadVisible"
                class="upload-demo"
                drag
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                :headers="uploadHeaders"
                name="image"
                :on-success="uploadSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>
    </div>
</template>
            
<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
    name: 'ImgIndex',
    components: {},
    props: {},
    data () {
        const user = JSON.parse(window.localStorage.getItem('user'))
        return {
            collect: false,
            imgs: [],
            dialogUploadVisible: false,
            uploadHeaders: {
                Authorization: `Bearer ${user.token}`
            },
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            collectLoading: false
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadImages(1);
    },
    mounted () {},
    methods: {
        loadImages(page){
            this.currentPage = page;
            getImages({
                collect: this.collect,
                page,
                per_page: this.pageSize
            }).then(res => {
                const result = res.data.data.results;
                result.forEach(item => {
                    item.loading = false
                })
                this.imgs = result;
                this.totalNum = res.data.data.total_count
            })
        },
        collectChange(value){
            this.loadImages(1)
        },
        uploadSuccess(){
            this.dialogUploadVisible = false;
            this.loadImages(this.currentPage)
            this.$message({
                type: 'success',
                message: '上传成功'
            })
        },
        handleCurrentChange(page){
            this.loadImages(page)
        },
        onCollect(img){
            img.loading = true;
            collectImage(img.id, !img.is_collected).then(res => {
                img.is_collected = !img.is_collected;
                img.loading = false;
            })
        },
        onDelete(img){
            img.loading = true;
            deleteImage(img.id).then(res => {
                this.loadImages(this.currentPage)
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .fy{
        text-align:center;
        margin-top:20px;
    }
    .img-item{
        position: relative;
    }
    .el-image{
        width: 100%;
    }
    .img-action{
        font-size: 22px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: #fff;
        height:40px;
        background: rgba(204, 204, 204, .5);
        position:absolute;
        bottom:4px;
        left:5px;
        right:5px;
        cursor: pointer;
    }
</style>