"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'diccionarios_compuestos',
        elementName:'diccionario',
        editable:admin,
        prefix:'diccom',
        fields:[
            {name:'diccom_diccom'       , typeName:'text'      , label:'diccionario' ,nullable:false},
            {name:'diccom_cla'          , typeName:'text'      , label:'clasificador',nullable:false},
            {name:'diccom_nombre'       , typeName:'text'      , label:'nombre'                     },
        ],
        primaryKey:['diccom_diccom', 'diccom_cla'],
        foreignKeys:[
            {references: 'clasificadores' , fields:[
                {source:'diccom_cla'   , target:'cla_cla'}
            ]},
            {references: 'diccionarios'   , fields:[
                {source:'diccom_cla'   , target:'dic_cla'},
                {source:'diccom_diccom', target:'dic_dic'}
            ]},
        ],
        detailTables:[
            {table: 'diccom_ent'     , fields:[
                {source:'diccom_cla'   , target:'diccoment_cla'},
                {source:'diccom_diccom', target:'diccoment_diccom'},
            ], abr:'E', label:'entradas'},
            {table: 'diccom_def'     , fields:[
                {source:'diccom_cla'   , target:'diccomdef_cla'},
                {source:'diccom_diccom', target:'diccomdef_diccom'},
            ], abr:'def', label:'entradas'},
        ],
        sql:{
            postCreateSqls:'alter table diccionarios_compuestos add constraint "diccom no se puede repetir" unique (diccom_diccom);'
        }
    });
}