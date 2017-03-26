"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'clasificadores',
        elementName:'clasificador',
        editable:admin,
        prefix:'cla',
        fields:[
            {name:'cla_cla'          , typeName:'text'      , label:'código'     ,nullable:false},
            {name:'cla_nombre'       , typeName:'text'      , label:'nombre'                    },
            {name:'cla_descripcion'  , typeName:'text'      , label:'descripción'               },
            {name:'cla_ori'          , typeName:'text'      , label:'origen'                    },
            {name:'cla_fuente'       , typeName:'text'      , label:'fuente'                    },
            {name:'cla_link'         , typeName:'text'      , label:'vínculo/dirección'         },
        ],
        primaryKey:['cla_cla'],
        foreignKeys:[
            {references: 'origenes'    , fields:[{source:'cla_ori', target:'ori_ori'}]},
        ],
        detailTables:[
            {table: 'cla_item'    , fields:[{source:'cla_cla', target:'claitem_cla'}], abr:'I', label:'ítems'},
            {table: 'diccionarios', fields:[{source:'cla_cla', target:'dic_cla'}], abr:'D', label:'diccionarios'},
        ]
    });
}