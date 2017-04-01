"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'origenes',
        title:'orígenes',
        elementName:'origen',
        editable:admin,
        prefix:'ori',
        fields:[
            {name:'ori_ori'          , typeName:'text'      , label:'origen'     ,nullable:false},
            {name:'ori_nombre'       , typeName:'text'      , label:'nombre'                    },
            {name:'ori_descripcion'  , typeName:'text'      , label:'descripción'               },
            {name:'ori_fuente'       , typeName:'text'      , label:'fuente'                    },
            {name:'ori_link'         , typeName:'text'      , label:'vínculo/dirección'         },
        ],
        primaryKey:['ori_ori'],
        detailTables:[
            {table: 'diccionarios'     , fields:[{source:'ori_ori', target:'dic_ori'}], abr:'D'},
            {table: 'clasificadores'   , fields:[{source:'ori_ori', target:'cla_ori'}], abr:'C'},
        ]
    });
}