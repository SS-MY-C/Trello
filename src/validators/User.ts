import { IsNotEmpty, Length } from 'class-validator';
import {IsSameVal} from './CustomValidationDecorators';

class UserBody {
    @Length(1,20,{
        message:"用户名不能为空或者大于20个字符"
    })
    name : string;
    @IsNotEmpty({
        message:"密码不能为空"
    })
    password: string;
}
//登录验证
export class RegisterBody extends UserBody{
    
    @IsSameVal('password',{
        message:"两次输入的密码不一致"
    })
    rePassword: string;
};

export class LoginBody extends UserBody{}