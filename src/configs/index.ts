import path from 'path';
import databaseConfig from './database.json';

interface IDatabaseConfig {
    host: string;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';
    username: string;
    password: string;
    database: string;
}

const configs = {
    development:{
        server:{
            host:'localhost',
            port:8000
        },
        database:databaseConfig.development as IDatabaseConfig,
        jwt:{key:'su'},
        storage:{
            dir:path.resolve(__dirname,'../attachments'),
            prefix:'/public/attachments'
        }
    },
    test:{
        server:{
            host:'localhost',
            port:8000
        },
        database:databaseConfig.development as IDatabaseConfig,
        jwt:{key:'su'},
        storage:{
            dir:path.resolve(__dirname,'../attachments'),
            prefix:'/public/attachments'
        }
    },
    production:{
        server:{
            host:'localhost',
            port:8000
        },
        database:databaseConfig.development as IDatabaseConfig,
        jwt:{key:'su'},
        storage:{
            dir:path.resolve(__dirname,'../attachments'),
            prefix:'/public/attachments'
        }
    },
};
//拿出configs类型的第一层key
type configKeys = keyof typeof configs;
//process读取环境信息 env存储环境变量的信息
const NODE_EVN = process.env.NODE_ENV as configKeys ||  'development';

export default configs[NODE_EVN];