/**
 * 获取tms内容，需要先使用init方法初始化，否则会返回空内容
 * 
 * @module tms-loader
 * @author yichaohuang.hyc
 */

'use strict';

var FileSyncClient = require('@ali/filesync-client'),
    fs = require('fs'),
    path = require('path'),
    iconv = require('iconv-lite');


//本地调试时，默认下载到node父目录下的tms文件夹下；其它环境，使用/home/admin/tms
var basePath = path.resolve(__dirname ,'../../../tms/');

var config = {
    appName: 'atb',
    localTmsFileBasePath: basePath
};
var fileSyncClient = new FileSyncClient(config);

/**
 * 获取指定路径的tms内容
 * @deprecated 由于有diamond连接数限制，需要改造，升级到midway5后，可以直接使用tms.load("aaa/bbb/ccc.php")获取tms内容
 * @param  {String} path     tms路径
 * @param  {String} encoding 编码形式(utf8,gbk...), 默认使用gbk编码
 * @return {String}          file content decoded in specific encoding            
 */


function getTMS(filePath, encoding) {
    return function*(){
        var collecter = yield fileSyncClient.createCollecter();
        collecter.startReport();
        if(!collecter) return '';
        yield collecter.collectAndDownload(filePath);

        if(!encoding) encoding = 'gbk';
        var realPath = path.join(basePath,filePath);
        var content = yield readFile(realPath, encoding);
        return content;
    }
}

function readFile(filePath, encoding){
    return new Promise((resolve, reject) => {
        fs.readFile(filePath,function(err,data){
            if(err) {
                resolve('');
            }
            else{
                resolve(iconv.decode(data,encoding));
            }
        });
    }).catch(err => {
        return '';
    });
}

module.exports = {
    getTMS: getTMS
}
