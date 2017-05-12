"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'diccom_ent',
        title:'entradas del diccionario compuesto',
        elementName:'entrada',
        editable:false,
        prefix:'diccoment',
        fields:[
            {name:'diccoment_diccom'       , typeName:'text'      , label:'diccionario'   },
            {name:'diccoment_cla'          , typeName:'text'      , label:'clasificador'  },
            {name:'diccoment_ent'          , typeName:'text'      , label:'entrada'       },
            {name:'diccoment_traduccion'   , typeName:'text'      , label:'traducción'    },
        ],
        primaryKey:['diccoment_diccom', 'diccoment_cla', 'diccoment_ent'],
        foreignKeys:[
            {references: 'diccionarios_compuestos'    , fields:[
                {source:'diccoment_cla'   , target:'diccom_cla'},
                {source:'diccoment_diccom', target:'diccom_diccom'}
            ]},
            {references: 'cla_item'        , fields:[
                {source:'diccoment_cla', target:'claitem_cla'},
                {source:'diccoment_traduccion', target:'claitem_item'}
            ]},
        ],
        sql:{
            from: `(
                select 'texto'::text as diccoment_diccom, 'comunas'::text as diccoment_cla, d1.dicent_ent as diccoment_ent, d2.dicent_traduccion as diccoment_traduccion
                  from dic_ent d1 
                  inner join dic_ent d2 
                  on d1.dicent_dic = 'texto'::text and d2.dicent_dic = 'barrios_fl'::text and d1.dicent_traduccion = d2.dicent_ent
                union
                  select 'texto'::text as diccoment_diccom, 'comunas'::text as diccoment_cla, dicent_ent, dicent_traduccion
                  from dic_ent
                  where dicent_dic = 'texto_excepciones'
            )`
        }
    },context);
}