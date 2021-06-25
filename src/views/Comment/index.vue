<template>
    <div class="comment-container">
        <el-card class="filter-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb style="display: inline-block;" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>评论管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-table :data="tableData" stripe class="tables" size="mini" style="width: 100%">
                <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
                <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
                <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
                <el-table-column prop="comment_status" label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.comment_status ? '正常' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.comment_status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :disabled="scope.row.statusDisabled"
                            @change="StatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <div slot="empty" class="empty">
                    <span>暂无数据</span>
                </div>
            </el-table>
            <el-pagination
                class="fy"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNum">
            </el-pagination>
        </el-card>
    </div>
</template>
            
<script>
import { getArticles, updateCommentStatus } from '@/api/article.js'
export default {
    name: 'CommentIndex',
    components: {},
    props: {},
    data () {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            loading :false
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadArticle(1);
    },
    mounted () {},
    methods: {
        loadArticle(page){
            this.currentPage = page;
            this.loading = true;
            this.$startLoading('.el-table__body-wrapper')
            getArticles({
                page,
                per_page: this.pageSize,
                response_type: 'comment'
            }).then(res => {
                this.loading = false;
                this.$endLoading();
                const result = res.data.data.results;
                result.forEach(item => {
                    item.statusDisabled = false;
                })
                this.tableData = result;
                this.totalNum = res.data.data.total_count;
            }).catch(error => {
                this.loading = false;
                this.$endLoading();
            })
        },
        handleSizeChange(){
            this.loadArticle(1)
        },
        handleCurrentChange(page){
            this.loadArticle(page)
        },
        StatusChange(article){
            article.statusDisabled = true;
            updateCommentStatus(article.id, article.comment_status).then(res => {
                article.statusDisabled = false;
                this.$message({
                    type: 'success',
                    message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .tables{
        margin-bottom: 15px;
    }
    .fy{
        text-align:center;
        margin-top:20px;
    }
</style>