const { log, error } = require("console");
const http = require("http");
const mongoose = require('mongoose');
const url = require('url');
const dotenv  = require('dotenv')
const Posts = require('./models/posts.model');
dotenv.config({path:"./config.env"})
log(process.env.PORT)


// 連接遠端資料庫
// const DB = process.env.DATABASE.replace(
//     '<password>',
//     process.env.DATABASE_PASSWORD
// )

// 連接本地資料庫
const DB = process.env.DATABASE

mongoose.connect(DB)
    .then(() => {
        log('資料庫連線成功')
    })
    .catch((error) => {
        log(error);
    });



const requestListener = async (req, res) => {
    const reqUrl = url.parse(req.url, true);

    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })

    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        'Content-Type': 'application/json'
    };
    if (req.url == "/posts" && req.method == "GET") {
        const posts = await Posts.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            posts
        }))
        res.end();
    } else if (req.url = "/posts" && req.method == "POST") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const newPosts = await Posts.create({
                    name: data.name,
                    title: data.title,
                    content: data.content,
                    author: data.author,
                    publishDate: data.publishDate,
                    lastUpdateDate: data.lastUpdateDate,
                    commentCount: data.commentCount,
                    likeCount: data.likeCount,
                    shareCount: data.shareCount,
                    postCategory: data.postCategory,
                    image: data.image,
                    link: data.link
                })
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status": "success",
                    posts: newPosts
                }))
                res.end();
            } catch (error) {
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    "status": "false",
                    "message": "欄位沒有正確，或是沒有此ID",
                    "error": error
                }))
                console.log(error);
                res.end();
            }
        })
    } else if (reqUrl.pathname == "/posts" && req.method == "DELETE") {
        const posts = await Posts.deleteMany({});
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            posts: []
        }))
        res.end();
    } else if (req.method == "PATCH" && reqUrl.pathname.startsWith('/posts/')) {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                // 從 URL 中獲取 ID 識別符號
                const id = reqUrl.pathname.split('/')[2]
                // const posts = await Posts.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
                const posts = await Posts.findByIdAndUpdate(id, data, { new: true });
                if (posts === null) {
                    res.writeHead(404, headers);
                    res.end(JSON.stringify({ status: 'false', message: '無此網站路由或id' }));
                } else {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        posts: posts
                    }))
                    res.end();
                }
            } catch (error) {
                res.writeHead(500, headers);
                res.end(JSON.stringify({ status: 'false', message: '發生錯誤' }));
            }
        });
    } else if (req.method == "DELETE" && reqUrl.pathname.startsWith('/posts/')) {
        // findByIdAndDelete
        req.on('end', async () => {
            try {
                // 從 URL 中獲取 ID 識別符號
                const id = reqUrl.pathname.split('/')[2]
                const posts = await Posts.findByIdAndDelete(id);
                console.log(posts);
                if (posts === null) {
                    res.writeHead(404, headers);
                    res.end(JSON.stringify({ status: 'false', message: '無此網站路由或id' }));
                } else {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                    }))
                    res.end();
                }
            } catch (error) {
                res.writeHead(500, headers);
                res.end(JSON.stringify({ status: 'false', message: '發生錯誤' }));
            }
        });
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);

        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由",
        }))
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);