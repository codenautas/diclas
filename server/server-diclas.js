"use strict";

var Path = require('path');
var backendPlus = require("backend-plus");
var MiniTools = require('mini-tools');

var changing = require('best-globals').changing;

class AppDiclas extends backendPlus.AppBackend{
    constructor(){
        super();
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
    getMenu(context){
        return {menu:[
            {menuType:'menu', name:'diccionarios', menuContent:[
                {menuType:'table', name:'diccionarios', label:'diccionarios'},
                {menuType:'table', name:'dic_ent', label:'entradas'  },
            ]},
            {menuType:'menu', name:'clasificadores', menuContent:[
                {menuType:'table', name:'clasificadores'},
                {menuType:'table', name:'cla_item', label:'ítems'},
            ]},
            {menuType:'menu', name:'orígenes', menuContent:[
                {menuType:'table', name:'origenes', label:'orígenes'},
            ]},
            {menuType:'menu', name:'configuración', menuContent:[
                {menuType:'table', name:'usuarios'},
            ]},
        ]}
    }
    getTables(){
        return super.getTables().concat([
            'origenes',   
            'diccionarios',
            'dic_ent', 
            'clasificadores',
            'cla_item',       
            'usuarios',
        ]);
    }
}

new AppDiclas().start();