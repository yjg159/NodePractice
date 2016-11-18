var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var topicUrl = 'http://blog.eastmoney.com/g75727572/bloglist_0_1.html';

superagent.get(topicUrl)
    .end(function(err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        // 获取首页所有的链接
        $('#wrapper #emblog_list .list ul li a').each(function(idx, element) {
            var $element = $(element);
            // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
            // 我们用 url.resolve 来自动推断出完整 url，变成
            // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
            // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
            //var href = url.resolve(topicUrl, $element.attr('href'));
            var href = $element.attr('href');
            topicUrls.push(href);
        });

        console.log(topicUrls);
    });
