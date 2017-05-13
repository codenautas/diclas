"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'diccom_def',
        title:'definición del diccionario compuesto',
        elementName:'definición',
        editable:admin,
        prefix:'diccomdef',
        fields:[
            {name:'diccomdef_diccom'        , typeName:'text'      , label:'diccionario'    },
            {name:'diccomdef_cla'           , typeName:'text'      , label:'clasificador'   },
            {name:'diccomdef_ruta'          , typeName:'text'      , label:'intermediario'  },
        ],
        primaryKey:['diccomdef_cla', 'diccomdef_diccom', 'diccomdef_ruta'],
        foreignKeys:[
            {references: 'diccionarios_compuestos'    , fields:[
                {source:'diccomdef_cla'   , target:'diccom_cla'},
                {source:'diccomdef_diccom', target:'diccom_diccom'}
            ]},
            {references: 'diccionarios'    , fields:[
                {source:'diccomdef_cla'    , target:'dic_cla'},
                {source:'diccomdef_ruta'   , target:'dic_dic'}
            ], alias:"paso2"},
            {references: 'diccionarios'    , fields:[
                {source:'diccomdef_ruta'   , target:'dic_cla'},
                {source:'diccomdef_diccom' , target:'dic_dic'}
            ], alias:"paso1"},
        ]
    },context);
}