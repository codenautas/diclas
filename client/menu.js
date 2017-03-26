"use string";

// var html=require('js-to-html').html;
var html=jsToHtml.html;

var bestGlobals = require('best-globals');
var changing = bestGlobals.changing;

var my = myOwn;

var buttonTableClicked=null;

function toggleButtonTableClicked(button){
    if(buttonTableClicked){
        buttonTableClicked.removeAttribute('menu-selected');
        buttonTableClicked=false;
    }
    if(button){
        button.setAttribute('menu-selected','yes');
        buttonTableClicked=button;
    }
}


function prepareTableButtons(){
    var buttonTables = document.querySelectorAll("button.tables");
    Array.prototype.forEach.call(buttonTables, function(button){
        button.addEventListener('click', function(){
            var layout = document.getElementById('table_layout');
            toggleButtonTableClicked(button);
            my.tableGrid(this.getAttribute('id-table'),layout);
        });
    });
    var buttonGroups = document.querySelectorAll("input.group");
    Array.prototype.forEach.call(buttonGroups, function(button){
        button.addEventListener('click', function(){
            toggleButtonTableClicked();
            table_layout.innerHTML='';
        });
    });
    var barrasIntermedias = document.querySelectorAll(".barra_intermedia");
    Array.prototype.forEach.call(barrasIntermedias, function(div){
        var ele=document.querySelectorAll('[id-grupo='+div.getAttribute('id-grupo')+']')[0];
        div.style.marginLeft=ele.offsetLeft+'px';
    });
}

window.addEventListener('load', function(){
    my.autoSetup().then(prepareTableButtons);
    document.getElementById('menu-derecha').addEventListener('click', menuDerecha);
});


function menuDerecha(){
    miniMenuPromise([
        {label:'usuario', startGroud:'true'},
        {img:my.path.img+'chpass.png' , label:'cambiar clave' , value:{que:'href', valor:'chpass'}},
        {img:my.path.img+'exit.png'   , label:'salir'         , value:{que:'href', valor:'logout'}}
    ],{
        underElement:document.getElementById('menu-derecha'),
        withCloseButton:false,
    }).then(function(rta){
        if(rta.que==='href'){
            window.location.href = rta.valor;
        }
    });
}

myOwn.clientSides=changing(myOwn.clientSides,{
    subir:{
        action: function(depot, fieldName){
            var td=depot.rowControls[fieldName];
            td.style.backgroundImage= "url('" +my.path.img+'import.png' + "')";
            td.style.backgroundRepeat= "no-repeat";
            // td.style.backgroundSize= "contain";
            td.style.paddingRight = "16px";
            td.style.backgroundPosition= "right";
            td.addEventListener('click',function(){
                td.style.backgroundColor='#DDF';
                var buttonFile=html.input({type:'file',style:'min-width:400px'}).create();
                var buttonConfirmImport=html.input({type:'button', value:my.messages.import}).create();
                var progressIndicator=html.div({class:'indicator'},' ').create();
                var progressBar=html.div({class:'progress-bar', style:'width:400px; height:8px;'},[progressIndicator]).create()
                var uploadingProgress=function(progress){
                    if(progress.lengthComputable){
                        progressIndicator.style.width=progress.loaded*100/progress.total+'%';
                        progressIndicator.title=Math.round(progress.loaded*100/progress.total)+'%';
                    }else{
                        progressIndicator.style.backgroundColor='#D4D';
                        progressIndicator.title='N/D %';
                    }
                }
                buttonConfirmImport.addEventListener('click', function(){
                    var files = buttonFile.files;
                    buttonConfirmImport.value='cargando...';
                    buttonConfirmImport.disabled=true;
                    bestGlobals.sleep(100).then(function(){
                        return my.ajax.documento.upload({
                            primaryKeyValues:depot.primaryKeyValues,
                            files:files
                        },{uploading:uploadingProgress});
                    }).then(function(result){
                        buttonConfirmImport.dialogPromiseDone(true);
                        td.setTypedValue(result.subido);
                    }).catch(function(err){
                        buttonConfirmImport.dialogPromiseDone(err);
                    });
                });
                simpleFormPromise({elementsList:[
                    my.messages.uploadFile.replace('$1',depot.row.archivo),
                    buttonFile,
                    html.br().create(),
                    buttonConfirmImport,
                    html.br().create(),
                    progressBar,
                ]}).then(function(message){
                    return alertPromise(message);
                });
            });
        }
    },
    incorporar:{
        action: function(depot, fieldName){
            var td=depot.rowControls[fieldName];
            //  td.setTypedValue(depot.row[fieldName]);
            td.style.backgroundImage= "url('" +my.path.img+'check-table.png' + "')";
            td.style.backgroundRepeat= "no-repeat";
            // td.style.backgroundSize= "contain";
            td.style.paddingRight = "16px";
            td.style.backgroundPosition= "right";
            td.addEventListener('click',function(){
                td.style.backgroundColor='#DDF';
                confirmPromise(
                    my.messages.confirmarIncorporacion
                    .replace('$1',depot.row.archivo)
                    .replace('$2',depot.row.renglon)
                    ,{askForNoRepeat:my.messages.confirmarIncorporacion}
                ).then(function(){
                    return my.ajax.indicadores.incorporar({
                        primaryKeyValues:depot.primaryKeyValues
                    }).then(function(result){
                        td.setTypedValue(result.incorporado);
                        return result;
                    }).catch(function(err){
                        alertPromise(err.message);
                    });
                });
            });
        }
    }
});

myOwn.messages.confirmarIncorporacion = "confirmar incorporación de los valores de indicadores del archivo $1 para los parámetros definidos en el renglón $2"; 
myOwn.messages.Ready = "Listo"; 