<template>
    <div class="article-container">
        <el-card class="filter-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb style="display: inline-block;" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>内容管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form" label-width="45px" size="mini">
                <el-form-item label="状态">
                    <el-radio-group v-model="status">
                        <el-radio :label="null">全部</el-radio>
                        <el-radio :label="0">草稿</el-radio>
                        <el-radio :label="1">待审核</el-radio>
                        <el-radio :label="2">审核通过</el-radio>
                        <el-radio :label="3">审核失败</el-radio>
                        <el-radio :label="4">已删除</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="频道">
                    <el-select v-model="channelId" placeholder="请选择频道">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option v-for="(item, index) in channelList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="rangDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="onSubmit">筛选</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 14px;">根据筛选条件共查询到{{totalNum}}条结果</span>
            </div>
            <el-table :data="tableData" stripe class="tables" size="mini" style="width: 100%">
                <el-table-column prop="imgs" label="封面">
                    <template slot-scope="scope">
                        <!-- <el-image
                            style="width: 100px; height: 100px"
                            :src="scope.row.cover.images[0]"
                            :fit="cover">
                            <div slot="placeholder" class="image-slot">
                                加载中<span class="dot">...</span>
                            </div>
                        </el-image> -->
                        <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">
                        <img v-else class="article-cover" src="./no-cover.gif" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag size="mini" :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].label}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="pubdate" label="发布时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="$router.push('/publish?id=' + scope.row.id.toString())" size="mini" circle></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="onDeleteArticle(scope.row.id)" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <div slot="empty" class="empty">
                    <span>暂无数据</span>
                </div>
            </el-table>
            <el-pagination
                class="fy"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                :total="totalNum"
                :disabled="loading">
            </el-pagination>
        </el-card>
    </div>
</template>
            
<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article.js'
export default {
    name: 'ArticleIndex',
    components: {},
    props: {},
    data () {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            status: null,
            channelId: null,
            channelList: '',
            rangDate: [],
            loading: false,
            articleStatus: [
                { status: '0', label: '草稿', type: 'info'},
                { status: '1', label: '待审核', type: ''},
                { status: '2', label: '审核通过', type: 'success'},
                { status: '3', label: '审核失败', type: 'warning'},
                { status: '4', label: '已删除', type: 'danger'}
            ]
        }
    },
    computed: {},
    watch: {},
    mounted () {
        this.loadChannels();
        this.loadArticles(1);
    },
    created () {},
    methods: {
        loadChannels(){
            getArticleChannels().then(res => {
                this.channelList = res.data.data.channels;
            })
        },
        onSubmit() {
            this.loadArticles();
        },
        loadArticles(page){
            this.loading = true;
            this.$startLoading('.el-table__body-wrapper')
            getArticles({
                page,
                per_page: this.pageSize,
                status: this.status,
                channel_id: this.channelId,
                begin_pubdate: this.rangDate ? this.rangDate[0] : null,
                end_pubdate: this.rangDate ? this.rangDate[1] : null
            }).then(res => {
                this.loading = false;
                this.$endLoading();
                this.tableData = res.data.data.results;
                this.totalNum = res.data.data.total_count;
            }).catch(error => {
                this.loading = false;
                this.$endLoading();
            })
        },
        handleCurrentChange(page){
            this.loadArticles(page)
        },
        onDeleteArticle(id){
            deleteArticle(id).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.loadArticles();
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .filter-card{
        margin-bottom: 15px;
    }
    .tables{
        margin-bottom: 15px;
    }
    .article-cover{
        width: 50px;
        background-size: cover;
    }
    .fy{
        text-align:center;
        margin-top:20px;
    }
    .image-slot{
        text-align: center;
        margin-top: 45px;
    }
</style>