#!/usr/bin/env node

var program     = require('commander');
var inquirer    = require('inquirer');
var request     = require('request');
var fs          = require('fs-extra');
var path        = require('path');
var AdmZip      = require('adm-zip');
var ProgressBar = require('progress');
var Spinner     = require('cli-spinner').Spinner;


var FLUX = {
          branch: "master",
          url: "http://github.com/frontend-labs/flux"
};

var fluxDownload  = FLUX.url + '/archive/' + FLUX.branch + '.zip';
var spinner       = new Spinner('processing.. %s');
    spinner
      .setSpinnerString('|/-\\');

var root    = path.resolve(".");
var fluxconfig = root + "/.flux";
var params  = ['module','action','controller']; // seteamos parametros aceptados
var bar = null;
var fn = {
  validNameCreate: function(value){
      if(value.length<1)
      {
        return "error: el nombre no es valido";
      }
      return true;
  }
};

var questions_init = [
  {
    type:"confirm",
    name: "init",
    message: "you want to install here? ("+root+")"
  }
];
var questions_module = [
  {
    type: "input",
    name: "module_name",
    message: "Name Module",
    validate: fn.validNameCreate
  },
  {
    type: "input",
    name: "controller_name",
    message: "Name Controller",
    default: function () { return "index"; },
    validate: fn.validNameCreate
  },
  {
    type: "input",
    name: "action_name",
    message: "Name Action",
    default: function () { return "index"; },
    validate: fn.validNameCreate
  },
];



// version del programa
program.version('0.0.1');

// programa inicializador
program
  .command('init')
  .description('description: comando importante para iniciar')
  .action(function () 
  {
    console.log('welcome to flux...');
    setTimeout(function()
    {
      inquirer.prompt(questions_init ,function(a)
      {
        if(a.init)
        {
          if (fs.existsSync(fluxconfig)) 
          {
            console.log('ya existe un proyecto iniciado');
          }
          else
          {
            downloadZip(fluxDownload);
          }
        }
        else
        {
          console.log('vuelve pronto..');
        }
      });
    },1000);
      
  });


// programa crear
program
  .command('create <option>')
  .description('description: '+ params.join(','))
  .action(function (option) 
  {
    if(in_array(params, option))
    {
    	inquirer.prompt( questions_module, function( answers ) 
    	{
			  console.log( JSON.stringify(answers, null, "  ") );
		    console.log('siguiente paso crear folders');
      });
    }
    else
    {
    	console.log('option not enable')
    }
  });

// programa editar
program
  .command('update <option>')
  .description('description: '+params.join(','))
  .action(function (option) {
    console.log('update %s', option);
  });

// programa eliminar
program
  .command('remove <option>')
  .description('description: '+params.join(','))
  .action(function (option) {
    console.log('remove %s', option);
  });

// extras
program.option('-d, --dest', 'probando 1234');

// programa run
program.parse(process.argv);




function downloadZip(zipUrl) 
{
	var _this = this;
	var zipFile = generateTemp() + '.zip';
  var ws = fs.createWriteStream(zipFile);
      ws.on('close', function()
      {
        extractZip.call(_this, zipFile, root, function() 
        {
         removeFileOrDirectory(zipFile)
         var ruta_tmp = root+'/'+github_get_repo_name(FLUX.url)+'-'+FLUX.branch;
         fs.copy(ruta_tmp, root, function(err){
          if(err) console.log(err);
          removeFileOrDirectory(ruta_tmp)
          fluxjson = {version:"0.0.1", application:{name:'test', path:root},generate: generateTemp()};
          fs.writeJson(root+'/.flux', fluxjson, function (err) {
            if(err) console.log(err)
          })
          console.log('instalacion correcta');
         });
        });
      });

  spinner.start();
  request
    .get(zipUrl)
    .on('response', function(res)
    {
      spinner.stop(true);
      var len = parseInt(res.headers['content-length'], 10);
      console.log("length ", len);
      if(!isNaN(len) && len>1000){
        bar = new ProgressBar('  downloading flux [:bar] :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: len
        });  
      }
      else{
        console.log('error');
      }
      
    })
    .on('data', function(chunk)
    {
      if(bar.tick){
        bar.tick(chunk.length);
        ws.write(chunk);
      }
    })
    .on('end', function(){
      ws.end();
    })
}

function removeFileOrDirectory(file)
{
	fs.remove(file, function (err) 
	{
		if (err) return console.error(err)
	})
}
function generateTemp () {
  return Date.now().toString() + '-' + Math.random().toString().substring(2)
}

function extractZip (zipFile, outputDir, callback) {
  var zip = new AdmZip(zipFile)
    , entries = zip.getEntries()
    , pending = entries.length
    ;
  function checkDone (err) {
    if (err) _this.emit('error', err)
    pending -= 1
    if (pending === 0) callback()
  }

  entries.forEach(function(entry) 
  {
    if (entry.isDirectory) return checkDone()

    var file = path.resolve(outputDir, entry.entryName)
    fs.outputFile(file, entry.getData(), checkDone)
  })
}

function github_get_repo_name(repo)
{
	return repo.replace(/http(?:s|)\:\/\/(?:www\.|)github\.com\/(?:.*?)\/(.*?)/, "$1")
}

function in_array(arr,valor)
{
	var i = arr.length;
	while(i--){
		if(arr[i]==valor) return true
	}
	return false;
}