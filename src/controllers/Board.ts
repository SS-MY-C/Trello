import {Body, Controller, Ctx, Delete, Flow, Get, Params, Post, Put} from 'koa-ts-controllers';
import authorization from '../middlewares/authorization';
import {Board as BoardModel} from '../models/Board'
import { Context } from 'koa';
import {PostAddBoardBody,UpdateBoardBody,getAndValidatorBoard} from '../validators/Board'

@Controller('/board')
@Flow([authorization])
export class BoardController{
    // 添加看板
    @Post('')
    public async addBoard(
        @Ctx() ctx:Context,
        @Body() body:PostAddBoardBody
    ){
        let {name} = body;
        let board = new BoardModel();
        board.name = name;
        board.userId = ctx.userInfo.id;

        await board.save();

        ctx.status = 201;
        return board
    }
    // 获取用户所有看板
    @Get('')
    public async getBoards(
        @Ctx() Ctx:Context
    ){
        let where = {
            userId:Ctx.userInfo.id
        };
        let boards = await BoardModel.findAll({where});

        return boards
    }
    // 获取当前登录用户指定的一个看板详情
    @Get('/:id(\\d+)')
    public async getBoard(
        @Ctx() Ctx:Context,
        @Params('id') id:number
    ){ 
        let board = await getAndValidatorBoard(id,Ctx.userInfo.id)
        return board
    }
    // 更新指定的看板
    @Put('/:id(\\d+)')
    public async updateBoard(
        @Ctx() ctx:Context,
        @Params('id') id:number,
        @Body() body: UpdateBoardBody
    ){
        let board = await getAndValidatorBoard(id,ctx.userInfo.id);
        board.name = body.name || board.name;

        await board.save();
        ctx.status = 204
        return board
    }
    // 删除指定的面板
    @Delete('/:id(\\d+)')
    public async deleteBoard(
        @Ctx() ctx:Context,
        @Params('id') id:number
    ){
        let board = await getAndValidatorBoard(id,ctx.userInfo.id);
        await board.destroy();
        ctx.status = 204;
    }


}
