import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsSameVal(property:string,validationOptions?:ValidationOptions){
    return function(
        target:Object, //目标
        propertyName:string  //装饰属性名称
    ){  // class-validator 提供的方法可以让我们注册验证装饰器
        registerDecorator({
            name:'IsSameVal',
            target:target.constructor,
            propertyName,
            constraints:[property],//需要验证的参数
            options:validationOptions,
            validator:{
                validate(value: any, validationArguments?:ValidationArguments):Promise<boolean> | boolean{
                    const relatedValue = validationArguments && (validationArguments.object as any)[property]//第一个参数指定的属性对应的值 validationArguments.object对类实例化

                    return relatedValue === value //value当前装饰器装饰的值
                }
            }
        });
    }
}