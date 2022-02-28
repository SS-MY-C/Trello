import configs from "./configs/index";
import Koa, { Context, Next } from 'koa';
import { bootstrapControllers } from 'koa-ts-controllers';
import KoaRouter from 'koa-router';
import path from "path";
import Koabody from 'koa-body';
import Boom from '@hapi/Boom';
import {Sequelize} from 'sequelize-typescript';
import jwt from 'jsonwebtoken';
import koaStaticCache from 'koa-static-cache';

(async () => {
    const app = new Koa();
    const router = new KoaRouter();

    app.use(koaStaticCache({
        dir:configs.storage.dir,
        prefix:configs.storage.prefix,
        gzip:true,
        dynamic:true
    }))

    //链接数据库
    const db = new Sequelize({
        ...configs.database,
        models: [__dirname + '/models/**/*']//模型文件
    });

    //鉴权信息处理
    app.use(async (ctx:Context, next:Next)=>{
        let token = ctx.header['authorization'];
        if(token){
            ctx.userInfo = jwt.verify(token, configs.jwt.key) as UserInfo;
        }
        await next();
    });

    //注册路由
    await bootstrapControllers(app, {
        router,
        basePath: '/api',
        versions: [1],
        controllers: [
            path.resolve(__dirname,'controllers/**/*') //匹配所有装饰器类
        ],
        errorHandler:async(err:any,ctx:Context)=>{
            let status = 500;
            let body:any = {
                statusCode:500, //状态文本
                error: "Internal Server error",
                message: "An internal server error"
            }

            if(err.output){
                status = err.output.statusCode;
                body = {...err.output.payload};
                if(err.data){
                    body.errDetails = err.data; 
                }
            }
            ctx.status = status;
            ctx.body = body;
        }
    });
    //上面没有匹配的路由错误
    router.all('*',async ctx=>{
        throw Boom.notFound('没有找到该路由')
    })

    app.use(Koabody({
        multipart:true,
        formidable:{
            uploadDir:configs.storage.dir,
            keepExtensions:true
        }
    }));
    app.use(router.routes());

    app.listen(configs.server.port, configs.server.host, () => {
        console.log(`服务启动成功:http://${configs.server.host}:${configs.server.port}`);
    });
})();