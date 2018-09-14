const request = require('request');

var buildHeaders = () => {
    var headers = {};
    headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';
    return headers;
};

exports.get = (url) => {
    return new Promise((resolve, reject) => {
        if(!url){
            return reject("Missing query param 'url'.");
        }
        console.log("fetch get", url);

        request({
            method: "GET",
            url : url,
            headers: buildHeaders()
        }, function(error, response, data){
            if(error){
                reject(error);
            } else {
                resolve(data);
            }
        });
    })
} ;


exports.post = (url, params) => {
    return new Promise((resolve, reject) => {
        if(!url){
            return reject("Missing query param 'url'.");
        }
        console.log("fetch post", url);
        request({
            method: "POST",
            url : url,
            json: params,
            headers: buildHeaders()
        }, function(error, response, data){
            if(error){
                reject(error);
            } else {
                resolve(data);
            }
        });
    })
} ;