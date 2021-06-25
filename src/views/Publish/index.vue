<template>
    <div class="publish-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb style="display: inline-block;" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{$route.query.id ? '修改文章': '发布文章'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="publish-form" :rules="formRules" v-model="article" size="mini" label-width="60px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-tiptap lang="zh" height="300" v-model="article.content" :extensions="extensions" placeholder="请输入文章内容"></el-tiptap>
                </el-form-item>
                <el-form-item label="封面">
                    <el-radio-group v-model="article.cover.type">
                        <el-radio :label="1">单图</el-radio>
                        <el-radio :label="3">三图</el-radio>
                        <el-radio :label="0">无图</el-radio>
                        <el-radio :label="-1">自动</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="频道" prop="channel_id">
                    <el-select v-model="article.channel_id" placeholder="请选择频道">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option v-for="(item, index) in channelList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(false)">发表</el-button>
                    <el-button @click="onSubmit(true)">存入草稿</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
            
<script>
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Image,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css';
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article.js'
import { uploadImage } from '@/api/image.js'
export default {
    name: 'PublishIndex',
    components: {
        'el-tiptap': ElementTiptap
    },
    props: {},
    data () {
        return {
            article: {
                title: '',
                content: '',
                cover: {
                    type: 1,   //-1:自动， 0:无图， 1:1张， 3:3张
                    images: []
                },
                channel_id: null
            },
            channelList: [],
            extensions: [
                new Doc(),
                new Text(),
                new Paragraph(),
                new Heading({ level: 5 }),
                new Bold({ bubble: true }), // render command-button in bubble menu.
                new Image({
                    // 自定义图片上传,把图片生成base64
                    uploadRequest(file){
                        const fd = new FormData();
                        fd.append('image', file)
                        return uploadImage(fd).then(res => {
                            return res.data.data.url
                        })
                    }
                }),
                new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
                new Italic(),
                new TextColor(),
                new Strike(),
                new ListItem(),
                new BulletList(),
                new OrderedList(),
                new TodoItem(),
                new TodoList(),
                new HorizontalRule(),
                new Fullscreen()
            ],
            formRules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur'},
                    { min: 5, max: 30, message: '长度在5到30个字符', trigger: 'blur'}
                ],
                content: [
                    {
                        validator(rule, value, callback){
                            if (value === '<p></p>') {
                            callback(new Error('请输入文章内容'));
                            } else {
                                callback();
                            }
                        }
                    },
                    { required: true, message: '请输入文章内容', trigger: 'blur'}
                ],
                channel_id: [
                    { required: true, message: '请选择文章频道'}
                ]
            }
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadChannels();
        if(this.$route.query.id){
            this.loadArticle();
        }
    },
    mounted () {},
    methods: {
        loadChannels(){
            getArticleChannels().then(res => {
                this.channelList = res.data.data.channels;
            })
        },
        onSubmit(draft) {
            this.$refs['publish-form'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                const articleId = this.$route.query.id
                if(articleId){
                    updateArticle(articleId, this.article, draft).then(res => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                    })
                }else{
                    addArticle(this.article, draft).then(res => {
                        this.$message({
                            message: '发布成功',
                            type: 'success'
                        })
                        this.$router.push('/article')
                    })
                }
            });
        },
        loadArticle(){
            getArticle(this.$route.query.id).then(res => {
                this.article = res.data.data
            })
        }
    }
}
</script>

<style lang="less" scoped></style>