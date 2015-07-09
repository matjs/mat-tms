




var router = require('koa-route');
var view_tms = require('..');
var views = require('koa-views');
var koa = require('koa');
var app = koa();


/**
 * Setup views.
 */


app.use(view_tms());

app.use(function* (next) {

  this.body = "111<!--TMS:rgn/tb-fp/2014/mm/atb/index/floor-nav-v2.php,gbk,1:TMS--><br />222<div></div><!--TMS:mm/footer.php,gbk,1:TMS-->3333"
});

app.listen(3000);
console.log('app running on port 3000');