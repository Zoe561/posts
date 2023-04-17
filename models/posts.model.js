const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: false, // 貼文標題可為空
            trim: true, // 移除字串前後的空白
            minlength: 1, // 最少一個字元
            maxlength: 200 // 最多兩百個字元
        },
        content: {
            type: String,
            required: true, // 貼文內容必填
            trim: true // 移除字串前後的空白
        },
        author: {
            type: String,
            required: true, // 作者必填
            trim: true, // 移除字串前後的空白
            minlength: 1, // 最少一個字元
            maxlength: 50 // 最多五十個字元
        },
        publishDate: {
            type: Date,
            required: false, // 發佈日期可為空
            default: Date.now // 預設值為現在時間
        },
        lastUpdateDate: {
            type: Date,
            required: false, // 最後更新日期可為空
            default: Date.now // 預設值為現在時間
        },
        commentCount: {
            type: Number,
            default: 0 // 預設值為0
        },
        likeCount: {
            type: Number,
            default: 0 // 預設值為0
        },
        shareCount: {
            type: Number,
            default: 0 // 預設值為0
        },
        postCategory: {
            type: String,
            required: false, // 貼文類別可為空
            trim: true, // 移除字串前後的空白
            maxlength: 50 // 最多五十個字元
        },
        image: {
            type: String,
            required: false, // 圖片可為空
            default: "" // 預設值為空字串
        },
        link: {
            type: String,
            required: false, // 連結可為空
            trim: true // 移除字串前後的空白
        },
        createdAt: {
            type: Date,
            required: true, // 建立時間必填
            default: Date.now, // 預設值為現在時間
            select: false // 不顯示在查詢結果中
        },
        name: {
            type: String,
            required: true, // 名稱必填
            trim: true, // 移除字串前後的空白
            minlength: 1, // 最少一個字元
            maxlength: 50 // 最多五十個字元
        },
        likes: {
            type: Number,
            default: 0 // 預設值為0
        }
    },
    {
        versionKey: false, // 不需要 __v 欄位
        // 定義 collecttion 名稱
        collecttion: 'posts',
        // 會加入createdAt、updateAt
        timestamps: true
    }
)
const Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts;