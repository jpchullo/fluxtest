var inquirer    = require('inquirer');
var Spinner     = require('cli-spinner').Spinner;

var spinner     = new Spinner(' %s');
    spinner
      .setSpinnerString('|/-\\');

module.exports = function(e){
    // run command init
    console.log(' Bienvenido, usted esta listo para crear flux?');
    console.log(' por favor seleccione alguna de las opciones disponibles');
    console.log('');
    console.log(' para salir del programa CTRL C');
    console.log('');

    spinner.start();

    setTimeout(function(){

        spinner.stop(true);

        inquirer.prompt([
        {
            type: "list",
            name: "html",
            message: "Selecciona tu preprocesador HTML:",
            choices: [
                "Jade",
                "Slim",
                "handlerbars",
                new inquirer.Separator(),
                "None"
            ]
        },
        {
            type: "list",
            name: "js",
            message: "Selecciona tu preprocesador JAVASCRIPT:",
            choices: [ 
                "coffescript", 
                "other",
                "none" 
            ]
        }
        ], function( answers ) {
            console.log( JSON.stringify(answers, null, "  ") );
        });
    },2000);
    
  
};
