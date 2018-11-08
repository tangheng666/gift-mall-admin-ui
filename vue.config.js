module.exports = {
    devServer: {
        host: '192.168.1.190',
        port: 9999,
        proxy: {
            '/rs': {
                target: 'http://182.61.16.69:8080/mall/', // 请求本地 需要后台项目
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