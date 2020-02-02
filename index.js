const hostname="localhost";
const port=8080;

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const {exec} = require('child_process');

//Init App
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Pages
var pages=[];
pages['home']=`${__dirname}/pages/home.html`;
pages['about']=`${__dirname}/pages/about.html`;
pages['error']=`${__dirname}/pages/error.html`;

//Use Static Files
app.use("/",express.static(__dirname+'/public'));

//Home Route
app.get('/',(req,res)=>{
  res.sendFile(pages['home']);
});
app.get('/about',(req,res)=>{
  res.sendFile(pages['about']);
});
app.get(/^(.+)$/,(req,res)=>{
  res.sendFile(pages['error']);
});

//Handling POST request
app.post('/',(req,res)=>{
  var code = req.body.code;
  var input = req.body.input;
  var compiler = req.body.compiler;
  compile(compiler,code,input,(output)=>{
    response = '<pre>'+output+'</pre>';
    res.send(response);
  });
});


//Start Server
app.listen(port,hostname,()=>{
  console.log(`Server started at ${hostname}:${port}`);
});

function compile(compiler,code,input,callback){
  let command,filename,output;
  console.log("RECEVIED:");
  console.log("Compiler:"+compiler);
  console.log("Code:"+code);
  console.log("Input:"+input);
  fs.writeFile('input.txt',input,'utf8',(err)=>{
      if(err) throw err;
      if(compiler==='PYTHON'){
        filename="code.py";
        // command=`python code.py < input.txt > output.txt`;
        command=`python code.py < input.txt`;
        fs.writeFile(filename,code,'utf8',(err)=>{
          if(err){
            console.log(err);
            return;
          }
          exec(command,(error,stdout,stderr)=>{
            if(error){
              console.log(error);
            }
            if(stderr){
              console.log(stderr);
              output ="STDERR:"+stderr;
            }else{
            console.log(stdout);
            output = stdout;
            }
            callback(output);
          });
        });
      }else if(compiler==='PYTHON3'){
        filename="code.py";
        // command=`python3 code.py < input.txt > output.txt`;
        command=`python3 code.py < input.txt`;
        fs.writeFile(filename,code,'utf8',(err)=>{
          if(err){
            console.log(err);
            return;
          }
          exec(command,(error,stdout,stderr)=>{
            if(error){
              console.log(error);
            }
            if(stderr){
              console.log(stderr);
              output ="STDERR:"+stderr;
            }else{
            console.log(stdout);
            output = stdout;
            }
            callback(output);
          });
        });
      }else if(compiler==='CPP'){
        filename = "code.cpp";
        command = "g++ code.cpp -o code.exe";
        fs.writeFile(filename,code,'utf8',(err)=>{
          if(err){
            console.log(err);
            return;
          }
          exec(command,(err,stdout,stderr)=>{
            if(err){
              console.log(err);
              return;
            }
            if(stderr){
              console.log(stderr);
              output="STDERR: "+stderr;
              callback(output);
            }else{
              command = "code.exe";
              exec(command,(err,stdout,stderr)=>{
                if(err){
                  console.log(err);
                  return;
                }
                if(stderr){
                  console.log(stderr);
                  output="STDERR: "+stderr;
                }
                else{
                  console.log(stdout);
                  output=stdout;
                }
                fs.unlink("code.exe",()=>{
                  console.log("File Deleted!");
                });
                callback(output);
              });
            }
          });
        });
      }else if(compiler==='C'){
        filename = "code.c";
        command = "gcc code.c -o code";
        fs.writeFile(filename,code,'utf8',(err)=>{
          if(err){
            console.log(err);
            return;
          }
          exec(command,(err,stdout,stderr)=>{
            if(err){
              console.log(err);
            }
            if(stderr){
              console.log(stderr);
              output="STDERR: "+stderr;
              callback(output);
            }else{
              command = `code.exe`;
              exec(command,(err,stdout,stderr)=>{
                if(err){
                  console.log(err);
                }
                if(stderr){
                  console.log(stderr);
                  output="STDERR: "+stderr;
                }
                else{
                  console.log(stdout);
                  output=stdout;
                }
                fs.unlink("code.exe",()=>{
                  console.log("File Deleted!");
                });
                callback(output);
              });
            }
          });
        });
      }else{
        output="INVALID COMPILER"
        callback(output);
        return;
      }
  });
}
