var page = require("webpage").create();

page.open("http://www.baidu.com/", function() {
    console.log("hello phantomjs");
    phantom.exit();
});