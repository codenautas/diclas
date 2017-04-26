"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'cla_item',
        title:'items del clasificador',
        elementName:'ítem',
        editable:admin,
        prefix:'claitem',
        fields:[
            {name:'claitem_cla'          , typeName:'text'      , label:'clasificador'  },
            {name:'claitem_item'         , typeName:'text'      , label:'ítem'          },
            {name:'claitem_nombre'       , typeName:'text'      , label:'nombre',isName:true},
        ],
        primaryKey:['claitem_cla', 'claitem_item'],  
        foreignKeys:[
            {references: 'clasificadores'    , fields:[{source:'claitem_cla', target:'cla_cla'}]},
        ],
        detailTables:[
            {table: 'dic_ent'     , fields:[{source:'dic_dic', target:'dicent_dic'}], abr:'E', label:'entradas'},
        ]
    },context);
}