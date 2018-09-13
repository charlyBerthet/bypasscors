const request = require('request');

exports.get = url => {
    return new Promise((resolve, reject) => {
        if(!url){
            return reject("Missing query param 'url'.");
        }
        request({
            method: "GET",
            url : url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }
        }, function(error, response, data){
            if(error){
                reject(error);
            } else {
                resolve(data);
            }
        });
    })
} ;