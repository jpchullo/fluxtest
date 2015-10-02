module.exports = Program;

function Program(cmd){
    
    this.cmd = cmd;
    
    this.VERSION = '0.0.1';

    this.run = function(option, callback){

        if(typeof this[option] == 'function'){
        
            this.cmd.version(this.VERSION);
            this[option](callback);
            this.cmd.parse(process.argv);
        }
        else
        {
            console.log('command not valid');
        }
    }
}

Program.prototype.init = function(cb) {
    this.cmd
        .command('init')
        .description('Inicializa configuración de flux')
        .action(cb);
};
Program.prototype.create = function(cb) {
    this.cmd
        .command('create')
        .description('Crea flux a partir de un archivo de configuración')
        .action(cb);
};
