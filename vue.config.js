module.exports = {
    devServer: {
        host: '192.168.1.190',
        port: 9999,
        proxy: {
            '/admin': {
                target: 'http://182.61.16.69:8080/mall/rs', // 请求本地 需要xboot后台项目
                ws: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false
}