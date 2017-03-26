"use strict";

var Path = require('path');
var backendPlus = require("backend-plus");
var MiniTools = require('mini-tools');

var changing = require('best-globals').changing;

class AppDiclas extends backendPlus.AppBackend{
    constructor(){
        super();
        this.rootPath=Path.resolve(__dirname,'..');
        console.log('rootPath',this.rootPath);
        this.tableStructures = {};
        this.tableStructures.origenes          = require('./table-origenes.js');
        this.tableStructures.diccionarios      = require('./table-diccionarios.js');
        this.tableStructures.dic_ent           = require('./table-dic_ent.js');
        this.tableStructures.clasificadores    = require('./table-clasificadores.js');
        this.tableStructures.cla_item          = require('./table-cla_item.js');
        this.tableStructures.usuarios          = require('./table-usuarios.js');
    }
    addLoggedServices(){
        var be = this;
        super.addLoggedServices();
        this.app.get('/echo', function(req,res){
            res.end('echo');
        });
    }
    getProcedures(){
        var be = this;
        return super.getProcedures().then(function(procedures){
            return procedures.concat(
                require('./procedures-diclas.js').map(be.procedureDefCompleter, be)
            );
        });
    }
}

new AppDiclas().start();