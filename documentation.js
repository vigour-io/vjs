"use strict";
var jsdoc2md = require("jsdoc-to-markdown");
var fs = require("fs");
var dmd = require("dmd");
var util = require("util");
var path = require("path");

/* paths used by this script */
var p = {
    src: path.resolve(__dirname, "lib/**/*.js"),
    json: path.resolve(__dirname, "./source.json"),
    output: path.resolve(__dirname, "vjs.wiki/%s.md")
}

/* we only need to parse the source code once, so cache it */
jsdoc2md({ src: p.src, json: true })
    .pipe(fs.createWriteStream(p.json))
    .on("close", dataReady);

function dataReady(){
    /* parse the jsdoc-parse output.. */
    var data = require(p.json);
    
    /* ..because we want an array of namespace names */
    var namespaces = data.reduce(function(prev, curr){
        if (curr.kind === "namespace") prev.push(curr.name);
        return prev;
    }, []);

    /* render an output file for each class */
    renderMarkdown(namespaces, 0);
}

function renderMarkdown(namespaces, index){
    var className = namespaces[index];
    var template = util.format('{{#namespace name="%s"}}{{>docs}}{{/namespace}}', className);
    console.log(util.format(
        "rendering %s, template: %s", className, template
    ));
    return fs.createReadStream(p.json)
        .pipe(dmd({ template: template }))
        .pipe(fs.createWriteStream(util.format(p.output, className)))
        .on("close", function(){
            var next = index + 1;
            if (namespaces[next]){
                renderMarkdown(namespaces, next);
            } else {
                fs.unlinkSync(p.json);
            }
        });
}
