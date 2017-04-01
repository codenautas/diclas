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

myOwn.messages.Ready = "Listo"; 