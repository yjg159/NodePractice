var express = require('express');//模板
var cheerio = require('cheerio');//加载数据
var superagent = require('superagent');//抓取内容

var app = express();

var Url = "http://blog.eastmoney.com/g75727572/bloglist_0_1.html";

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get(Url)
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#wrapper #emblog_list .list ul li').each(function (idx, element) {
        var $element = $(element);
        items.push({
	        title: $element.find('a').text().trim(),
	        href: $element.find('a').attr('href'),
	        time: $element.find('span').text().trim()
	      //author: $element.parents('.cell').find('img').attr('title')
          //author: $('#topic_list .cell ').find("img").attr('title')
          //author: $('#topic_list .user_avatar').find("img").attr('title')
        });
      });

      res.send(items);
    });
});


app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
