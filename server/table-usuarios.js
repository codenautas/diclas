"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'usuarios',
        title:'usuarios',
        editable:admin,
        fields:[
            {name:'usuario'         , typeName:'text'   , nullable:false, allow:{update:false} },
            {name:'md5clave'        , typeName:'text'                   , allow:{select: context.forDump} },
            {name:'activo_hasta'    , typeName:'date'                   , editable:admin},
            {name:'bloqueado_desde' , typeName:'date'                   , editable:admin},
            {name:'rol'             , typeName:'text'                   , editable:admin},
            {name:'clave_nueva'     , typeName:'text', clientSide:'newPass', allow:{select:admin, update:false, insert:false} },
        ],
        primaryKey:['usuario'],
        sql:{
            where:admin?'true':"usuario = "+context.be.db.quoteText(context.user.usuario)
        }
    });
}