import { Body, Controller, Ctx, Get, Header, Params, Post, Query } from "koa-ts-controllers";
import { IsNotEmpty, IsNumberString } from 'class-validator';
import Boom from '@hapi/Boom';
import { Context } from "koa";

class GetUsersQuery {
    @IsNumberString()
    page:number;
}

class PostUserBody {
    @IsNotEmpty({
        message:"用户名不能为空"
    })
    name:string;
    @IsNotEmpty({
        message:"密码不能为空"
    })
    password:string;
}

@Controller('/test')
class TestControllers {
    @Get('/hello')
    async hello(a:any) {
        console.log(a.b);
        
        return 'hello Test';
    }
    @Get('/user/:id(\\d+)')
    async getUser(
        @Params('id') id: number
    ) {
        return '当前params的id是' + id;
    }
    @Get('/user2')
    async getUser2(
        @Query() query: { id: number }
    ) {
        return '当前params的id' + query.id
    }

    @Post('/user3')
    async PostUser(
        @Ctx() ctx:Context,
        @Body() body: PostUserBody,
        @Header() h: any
    ) {
        // console.log('header', h);

        // return `当前提交的数据时:${JSON.stringify(body)}`;
        ctx.status = 201;
        return {
            id:1,
            name:body.name,
            createAt:new Date()
        }
    }
    @Get('/users')
    async getUsers(
        @Query() q:GetUsersQuery
    ){
        // console.log(q);
        if(q.page == 100){
            throw Boom.notFound('注册失败','用户已经被注册了');
        }
        return '传过来的query' + JSON.stringify(q)
    }
}