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
            {name:'diccoment_ruta'         , typeName:'text'      },
            {name:'diccoment_intermedio'   , typeName:'text'      },
            {name:'diccoment_exactitud'    , typeName:'text'      },
            {name:'diccoment_obs'          , typeName:'text'      },
        ],
        primaryKey:['diccoment_diccom', 'diccoment_cla', 'diccoment_ent'],
        foreignKeys:[
            {references: 'diccionarios_compuestos'    , fields:[
                {source:'diccoment_cla'   , target:'diccom_cla'},
                {source:'diccoment_diccom', target:'diccom_diccom'}
            ]},
            {references: 'cla_item'        , fields:[
                {source:'diccoment_cla'       , target:'claitem_cla'},
                {source:'diccoment_traduccion', target:'claitem_item'}
            ]},
            {references: 'cla_item'        , fields:[
                {source:'diccoment_ruta'       , target:'claitem_cla'},
                {source:'diccoment_intermedio' , target:'claitem_item'}
            ], alias:'intermedio'},
        ],
        softForeignKeys:[
            {references: 'cla_item'        , fields:[
                {source:'diccoment_diccom'    , target:'claitem_cla'},
                {source:'diccoment_ent'       , target:'claitem_item'}
            ], alias:'item'},
        ],
        sql:{
            from: `(
                select diccomdef_diccom     as diccoment_diccom, 
                       diccomdef_cla        as diccoment_cla, 
                       d1.dicent_ent        as diccoment_ent, 
                       d2.dicent_traduccion as diccoment_traduccion,
                       diccomdef_ruta       as diccoment_ruta,
                       d1.dicent_traduccion as diccoment_intermedio,
                       coalesce('1: '||d1.dicent_exactitud,'')||case when d1.dicent_exactitud is not null and d2.dicent_exactitud is not null then '; ' else '' end||coalesce('2: '||d2.dicent_exactitud,'')        as diccoment_exactitud,
                       coalesce('1: '||d1.dicent_obs      ,'')||case when d1.dicent_obs       is not null and d2.dicent_obs       is not null then '; ' else '' end||coalesce('2: '||d2.dicent_obs      ,'')        as diccoment_obs
                  from diccom_def dd
                    inner join dic_ent d1 on d1.dicent_dic = dd.diccomdef_diccom and d1.dicent_cla = dd.diccomdef_ruta
                    inner join dic_ent d2 on d2.dicent_dic = dd.diccomdef_ruta   and d2.dicent_cla = dd.diccomdef_cla 
                                             and d1.dicent_traduccion = d2.dicent_ent
                union
                select dicent_dic, dicent_cla, dicent_ent, dicent_traduccion,
                       null, null, dicent_exactitud, dicent_obs
                  from diccom_def dd
                    inner join dic_ent de on de.dicent_dic = dd.diccomdef_diccom and de.dicent_cla = dd.diccomdef_cla
            )`
        }
    },context);
}