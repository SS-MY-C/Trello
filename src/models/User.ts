import { 
    Model, PrimaryKey, Table, AutoIncrement, Column, AllowNull, Unique, DataType, CreatedAt, UpdatedAt
} from 'sequelize-typescript';
const crypto = require('crypto');

//映射表
@Table({
    tableName:'User' //对应的表
})
export class User extends Model<User> {
    //设置数据库中映射的数据的类型
    @PrimaryKey
    @AutoIncrement
    @Column
    id:number;

    @AllowNull(false)
    @Unique(true)
    @Column({
        type:DataType.STRING(50)
    })
    name:string;
    
    @Column
    set password(val:string){
        let md5 = crypto.createHash('md5');
        let newPassword = md5.update(val).digest('hex');
        //模型类提供的将newPassword映射到表中的password
        this.setDataValue('password',newPassword) 
        
    };

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}