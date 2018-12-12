var http = require('http');
var static = require('/usr/local/lib/node_modules/npm/node_modules/node-static');
var file = new static.Server('.');

var test_answer = "IT WORKS!";
var answer = "";
var x = 25;

function accept(req, res) {

    console.log(req.url);
    // если URL запроса /vote, то...
    if (req.url == '/vote') {
        var mysql      = require('/Users/gt_ejik/WebstormProjects/test_nodeJS_app/node_modules/mysql');
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '5672',
            database : 'ikea'
        });

        connection.connect();

        connection.query('SELECT * FROM departs', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            console.log(results.length);
            for (var i = 0; i < results.length; i++){
                answer += results[i].D_name + "\n";
            }
            //answer = results[1].D_name;
        });


        res.end(answer);
        connection.end();
        answer = "";
        //res.end('SO, IT WORKS!!');


    } else if (req.url[1] == 'd') {

        var depart_name = req.url.substring(4);


        var mysql      = require('/Users/gt_ejik/WebstormProjects/test_nodeJS_app/node_modules/mysql');
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '5672',
            database : 'ikea'
        });

        connection.connect();

        /*/connection.query('SELECT * FROM departs', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            console.log(results.length);
            for (var i = 0; i < results.length; i++){
                answer += results[i].D_name + "\n";
            }
            //answer = results[1].D_name;
        });
        */

        connection.query('INSERT INTO departs VALUES ('+ x +', ?, 01010, 00010)', depart_name, function(err, result) {
            console.log(err);
            console.log(result);
        });

        res.end(answer);
        connection.end();
        x += 1;
        console.log("Name: " + depart_name);



    } else {
        // иначе считаем это запросом к обычному файлу и выводим его
        file.serve(req, res); // (если он есть)
    }


}


// ------ этот код запускает веб-сервер -------

if (!module.parent) {
    http.createServer(accept).listen(8080);
} else {
    exports.accept = accept;
}