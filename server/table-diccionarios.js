"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'diccionarios',
        elementName:'diccionario',
        editable:admin,
        prefix:'dic',
        fields:[
            {name:'dic_dic'          , typeName:'text'      , label:'diccionario' ,nullable:false},
            {name:'dic_cla'          , typeName:'text'      , label:'clasificador',nullable:false},
            {name:'dic_nombre'       , typeName:'text'      , label:'nombre'                     },
        ],
        primaryKey:['dic_cla', 'dic_dic'],
        foreignKeys:[
            {references: 'clasificadores' , fields:[{source:'dic_cla', target:'cla_cla'}]},
        ],
        detailTables:[
            {table: 'dic_ent'     , fields:[
                {source:'dic_cla', target:'dicent_cla'},
                {source:'dic_dic', target:'dicent_dic'},
            ], abr:'E', label:'entradas'},
        ],
        sql:{
            postCreateSqls:'alter table diccionarios add constraint "dic no se puede repetir" unique (dic_dic);'
        }
    },context);
}