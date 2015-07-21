var debug = require('debug')('mat-tms');
var TMS = require("midway-tms");
var thunkify = require("thunkify");
var toString = Object.prototype.toString;
var named = require('named-regexp').named;
var Stream = require('stream')


function cobody(stream) {
  return function(cb){
    var buffers = []
    stream.on('data', function(chunk){
      buffers.push(chunk)
    })
    stream.on('end', function(){
      cb(null, Buffer.concat(buffers).toString('utf-8'))
    })
  }
} 

module.exports = function (tmsOption){

    tmsOption = tmsOption || {
        // 配置缓存失效（5分钟）
        timeout: 5 * 60 * 1000, 
        // 配置服务器本地目录
        filePath : '/home/tms/',

        // <!--TMS:rgn/tb-fp/2014/mm/atb/index/floor-nav-v2.php,gbk,1:TMS-->
        tmsRegex : /<!--TMS:(?:rgn\/)?(:<url>[^,]*),(:<encoding>[^,]*),\d:TMS-->/ig
    }

    var tmsRegex = named(tmsOption.tmsRegex);
    var tms_cache = new TMS(tmsOption);
    var load = function(path, option, cb){
        debug("tms uri:" + path)
        
        tms_cache.load(path, option, function(err, succ){
            if(err){
                debug("tms err:" + err)
            }
            cb(null, err ? "" : succ);
        });
       
    }


    load = thunkify(load);

    return function *tms(next){
        
        yield next;

        var body = this.body
        if ( body && Buffer.isBuffer(body)){
            body = body.toString()
        }
        else if (body && body instanceof Stream ) {
            body = yield cobody(this.body)
        } else if (!body) {
            return 
        } 
        var pathLoad = [];
        var matched

        // 查找 整个的 tms
        while (matched = tmsRegex.exec(body)) {
            var option = {}

            // 查找tms上的属性
            for(cap in matched.captures){
              option[cap] = matched.captures[cap] && matched.captures[cap][0]
            }
            
            if(option.url){
                pathLoad.push(load(option.url, option))
            }else{
                pathLoad.push("");
            }
            
        }
        
        pathLoad = yield pathLoad;

        this.body = tmsRegex.replace(body,  function(){
            return pathLoad.shift();
        })
        
    }
}
