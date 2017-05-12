"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'dic_ent',
        title:'entradas del diccionario',
        elementName:'entrada',
        editable:admin,
        prefix:'dicent',
        fields:[
            {name:'dicent_dic'           , typeName:'text'      , label:'diccionario'   },
            {name:'dicent_cla'           , typeName:'text'      , label:'clasificador'  },
            {name:'dicent_ent'           , typeName:'text'      , label:'entrada'       },
            {name:'dicent_traduccion'    , typeName:'text'      , label:'traducción'    },
            {name:'dicent_exactitud'     , typeName:'integer'   , label:'exactitud'     },
            {name:'dicent_obs'           , typeName:'text'      , label:'observaciones' },
        ],
        primaryKey:['dicent_dic', 'dicent_ent'],
        foreignKeys:[
            {references: 'diccionarios'    , fields:[
                {source:'dicent_cla', target:'dic_cla'},
                {source:'dicent_dic', target:'dic_dic'}
            ]},
            {references: 'cla_item'        , fields:[
                {source:'dicent_cla', target:'claitem_cla'},
                {source:'dicent_traduccion', target:'claitem_item'}
            ]},
        ]
    },context);
}