import { AutoIncrement, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import {User} from './User'
import {Board} from './Board'

@Table({
    tableName:'BoardList'
})
export class BoardList extends Model<BoardList>{

    @PrimaryKey
    @AutoIncrement
    @Column
    id:number;

    @ForeignKey(()=>User)
    @Column({
        type:DataType.INTEGER.UNSIGNED,
        allowNull:false
    })
    userId:number;

    @ForeignKey(()=>Board)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull:false
    })
    boardId:number;

    @Column({
        type:DataType.STRING(255),
    })
    name:string;

    @Column({
        type:DataType.FLOAT,
        allowNull:false,
        defaultValue:0
    })
    order:number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    UpdatedAt:Date;
}