import { IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';
import Boom from '@hapi/Boom';
import {Board as BoardModel} from '../models/Board';


export class PostAddBoardBody{
    @IsNotEmpty({
        message:'面板名称不能为空'
    })
    @MaxLength(255,{
        message:'面板名称不能大于255字符'
    })
    name:string
}


export class UpdateBoardBody{
    @ValidateIf( o=>o.name !== undefined)
    @MaxLength(255,{
        message:'面板名称不能大于255字符'
    })
    name?:string
}

export async function getAndValidatorBoard(id:number , userId:number):Promise<BoardModel>{
    let board = await BoardModel.findByPk(id);
        if(!board){
            throw Boom.notFound('指定看板不存在');
        }
        if(board.userId !== userId){
            throw Boom.forbidden('禁止访问该面板');
        }
        return board
}