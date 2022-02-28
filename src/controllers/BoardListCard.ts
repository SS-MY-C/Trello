import { Context } from 'koa';
import {Ctx,Controller,Flow, Post, Body, Get, Query, Params, Put, Delete} from 'koa-ts-controllers';
import authorization from '../middlewares/authorization';
import {getBoardListCard,PutUpdateCardBody,PostAddCardBody,
    GetCardsQuery,PutSetCoverBody,getBoardListCardAttachment
} from '../validators/BoardListCard';
import { getBoardList } from '../validators/BoardList';
import {BoardListCard as BoardListCardModel} from '../models/BoardListCard';
import {Comment as CommentModel} from '../models/Comment';
import { CardAttachment as CardAttachmentModel } from '../models/CardAttachment';
import { Attachment as AttachmentModel } from '../models/Attachment';
import configs from '../configs';
import Boom from '@hapi/Boom';

@Controller('/card')
@Flow([authorization])
export class BoardListCardController{
    
    // 创建卡片
    @Post('')
    public async addCard(
        @Ctx() ctx:Context,
        @Body() body:PostAddCardBody
    ){
        let {boardListId , name , description} = body;
        await getBoardList(boardListId,ctx.userInfo.id);
        let boardListCard = new BoardListCardModel();
        boardListCard.userId = ctx.userInfo.id;
        boardListCard.boardListId = boardListId;
        boardListCard.name = name;
        boardListCard.description = description || '';

        await boardListCard.save();
        ctx.status = 201;
        return boardListCard;
    }

    // 获取卡片列表
    @Get('')
    public async getCards(
        @Ctx() ctx:Context,
        @Query() query:GetCardsQuery
    ){
        let {boardListId} = query;

        await getBoardList(boardListId,ctx.userInfo.id);
        let boardListCards = await BoardListCardModel.findAll({
            where:{
                boardListId
            },
            order:[['id','asc']],
            include:[
                {
                    model:CommentModel,
                    attributes:['id']
                },
                {
                    model:CardAttachmentModel,
                    include:[
                        {
                            model:AttachmentModel
                        }
                    ]
                }
            ]
        });

        let boardListCardsData = boardListCards.map((card:BoardListCardModel)=>{
            let coverPath = '';
            let Attachments = card.attachments.map(attachment=>{
                let data = attachment.toJSON() as CardAttachmentModel & {path:string};
                data.path = configs.storage.prefix + '/' + data.detail.name;
                if(data.isCover){
                    coverPath = data.path;
                }
                return data;
            })
            return {
                id:card.id,
                userId:card.userId,
                boardListId:card.boardListId,
                name:card.name,
                description:card.description,
                order:card.order,
                createdAt:card.createdAt,
                updatedAt:card.updatedAt,
                attachments:Attachments,
                coverPath:coverPath,
                commentCount:card.comments.length
            }

        })
        return boardListCardsData;
    }

    // 获取一个卡片信息
    @Get('/:id(\\d+)')
    public async getCard(
        @Ctx() ctx:Context,
        @Params('id') id:number
    ){
        let boardListCard = await getBoardListCard(id,ctx.userInfo.id);

        return boardListCard
    }

    // 更新卡片
    @Put('/:id(\\d+)')
    public async putCard(
        @Ctx() ctx:Context,
        @Params('id') id:number,
        @Body() body:PutUpdateCardBody
    ){
        let {boardListId,name,description,order} = body
        let boardListCard = await getBoardListCard(id,ctx.userInfo.id);
        boardListCard.boardListId = boardListId || boardListCard.boardListId
        boardListCard.name = name || boardListCard.name
        boardListCard.description = description || boardListCard.description
        boardListCard.order = order || boardListCard.order

        await boardListCard.save();
        ctx.status = 204;
        return boardListCard;
    }

    // 删除卡片
    @Delete('/:id(\\d+)')
    public async deleteCard(
        @Ctx() ctx:Context,
        @Params('id') id:number
    ){
        let boardListCard = await getBoardListCard(id,ctx.userInfo.id);
        await boardListCard.destroy()
        ctx.status = 204;
        return;
    }

    // 附件上传
    @Post('/attachment')
    public async addAttachment(
        @Ctx() ctx:Context,
        @Body() body:any
    ){
        let {boardListCardId} = body;

        let card = await getBoardListCard(boardListCardId, ctx.userInfo.id);

        //ctx.request.files.attachment;
        if (!ctx.request.files || !ctx.request.files.attachment) {
            throw Boom.badData('缺少附件');
        }

        let file = ctx.request.files.attachment as any;
        // console.log(file);z

        let attachment = new AttachmentModel();
        attachment.userId = ctx.userInfo.id;
        attachment.originName = file.name;
        attachment.name = file.path.split('\\').pop() as string;
        attachment.type = file.type;
        attachment.size = file.size;
        await attachment.save();

        let cardAttachment = new CardAttachmentModel();
        cardAttachment.userId = ctx.userInfo.id;
        cardAttachment.boardListCardId = boardListCardId;
        cardAttachment.attachmentId = attachment.id;
        await cardAttachment.save();

        ctx.status = 201;
        return {
            id: cardAttachment.id,
            userId: cardAttachment.userId,
            boardListCardId: cardAttachment.boardListCardId,
            attachmentId: attachment.id,
            path: configs.storage.prefix + '/' + attachment.name,
            isCover: false,
            detail: attachment
        }
    }

     // 删除附件
     @Delete('/attachment/:id(\\d+)')
     public async deleteAttachment(
         @Ctx() ctx:Context,
         @Params('id') id:number
     ){
         let cardAttachment = await getBoardListCardAttachment(id,ctx.userInfo.id);
         await cardAttachment.destroy();
         ctx.status = 204;
         return;
     }
    

    // 设置封面
    @Put('/attachment/cover/:id(\\d+)')
    public async setCover(
        @Ctx() ctx:Context,
        @Params('id') id:number
    ){
        // let {attachmentId} = body;
        let cardAttachment = await getBoardListCardAttachment(id,ctx.userInfo.id);

        await CardAttachmentModel.update({
            isCover:false
        },{
            where:{
                boardListCardId:cardAttachment.boardListCardId
            }
        })
        cardAttachment.isCover =true;
        await cardAttachment.save();

        ctx.status = 204;
        return;
    }

    // 取消封面
    @Delete('/attachment/cover/:attachmentId(\\d+)')
    public async deleteCover(
        @Ctx() ctx:Context,
        @Params('attachmentId') attachmentId:number
    ){
        let cardAttachment = await getBoardListCardAttachment(attachmentId,ctx.userInfo.id);
        cardAttachment.isCover = false;
        cardAttachment.save();

        ctx.status = 204;
        return ;
    }

   
}

