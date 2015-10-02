#!/usr/bin/env node

var commander   = require('commander');
var fs          = require('fs-extra');

var program_init = require('./programs/init');
var program = require('./program');


var cli = new program(commander);

// INIT
cli.run('init', program_init);


// console.log(prompts);
// inquirer.prompt(prompts.init, init);
