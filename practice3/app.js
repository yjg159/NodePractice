var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

//某个新浪博客的 url
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

        var concurrencyCount = 0;
        var fetchUrl = function(url, callback) {
            var delay = parseInt((Math.random() * 10000000) % 2000, 10);
            concurrencyCount++;
            //请求
            superagent.get(url)
            .end(function(err, res) {
                if (err) {
                    return console.log(err);
                }
                var $ = cheerio.load(res.text);
                var title = $('#wrapper #eb_content .articleTitle').text().trim();
                var content = $('#wrapper #eb_content #articleBody').text().trim();
                //console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒, ' + 'title:' + title + ', content:' + content);
                //写入文件
                fs.writeFile('result/' + title + '.pages', content, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('success');
                    }
                })
            })
            
            setTimeout(function() {
                concurrencyCount--;
                callback(null, url);
            }, delay);
        };

        async.mapLimit(topicUrls, 10, function(url, callback) {
            fetchUrl(url, callback);
        }, function(err, result) {
            console.log('final:');
            console.log(result);
        });
    });
