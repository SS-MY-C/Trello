module.exports = {
    devServer:{
        proxy:{
            '/api':{
                target:'http://localhost:8000',
                pathRewrite:{
                    '^/api':'/api/v1'
                }
            }
        }
    }
}