# mat-tms

  mat读取tms文件，目前是基于filesync-client。


## 安装

```
$ npm install mat-tms
```

## Example

```js

var mat  = require('mat')
var mat-tms = require('mat-tms')

// 反向代理
mat.task('daily', function () {
  mat.url([/\.html/])
    .use(mat-tms({
      tmsRegex: /<!--TMS:(:<prefix>rgn)?\/?(:<url>[^,]*),(:<encoding>[^,]*),\d:TMS-->/ig
    }))
    .use(mat-tms({
      tmsRegex: /\{\{tms\("(:<url>[^"]*)","(:<prefix>\w*)"\)}}/ig
    }))
})
```

* 通过正则表达式过滤出url，以前其他参数，其他参数支持  midway-tms的参数
* 本来正则表达时不支持分组命名，用了一个组件：[named-regexp](https://github.com/cho45/named-regexp.js)

# License

  MIT