"use strict";

var regExpDescartarValor = /^\s*(s\/d|-|\s*)\s*$/;

var fs = require("fs-promise");
var xlsx = require("xlsx-style");

var importador = {};

var abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function clone(obj){
    var rta={};
    for(var name in obj){
        rta[name] = obj[name];
    }
    return rta;
}

function letraANumero(letras){
    return letras.split('').reduce(function(acum, letra){
        return acum * 26 + abecedario.indexOf(letra)+1;
    },0);
}

letraANumero('C');

function numeroALetra(numero){
    var letras = '';
    numero--;
    do{
        letras = abecedario[numero % 26] + letras;
        numero = Math.floor(numero/26)-1;
    }while(numero>=0);
    return letras;
}

numeroALetra(1);
numeroALetra(3);
numeroALetra(26);
numeroALetra(27);
numeroALetra(26*2);
numeroALetra(26*2+1);

importador.importar = function importar(opts){
    // console.log('xxxxxxxxxxxx ----------',opts);
    return fs.readFile(opts.path).then(function(rawData){
        // console.log('xxxxxxxxxxx ----------',opts.path,'readed');
        var workbook = xlsx.read(rawData);
        var sheets = workbook.SheetNames;
        return opts.series.map(function(serieDef){
            var campos=[ 
                {dimension:'periodo'  ,columna:'periodo'},
                {dimension:'ut'       ,columna:'cod_ut' },
                {dimension:'indicador',columna:'cod_ind'}
            ];
            var regExpRango=/(.*)!([A-Z]+)(\d+):([A-Z]+)(\d+)\s*$/;
            var matchesV = serieDef.valores.match(regExpRango);
            var [__,hojaV,letraDesdeV,iFilaV,letraHastaV,iFilaHastaV] = matchesV;
            var iFilaV = Number(iFilaV);
            var iFilaHastaV = Number(iFilaHastaV);
            var iColumnaV = letraANumero(letraDesdeV);
            var iColumnaHastaV = letraANumero(letraHastaV);
            var sheetV = workbook.Sheets[hojaV];
            var procesarCampo = function(valoresFinales, valoresDecididos, iCampo, iFila, iColumna){
                var campoDef = campos[iCampo];
                var fuenteValores = serieDef[campoDef.dimension];
                var valores = [];
                var matches = fuenteValores.match(regExpRango);
                var delta={fila:0, columna:0};
                if(serieDef.columnas==campoDef.dimension){
                    delta.columna=1;
                }else{
                    delta.fila=1;
                }
                if(matches){
                    var [__,hoja,letraDesde,iFilaT,letraHasta,iFilaHasta] = matches;
                    var sheet = workbook.Sheets[hoja];
                    var iFilaT = Number(iFilaT);
                    var iFilaHasta = Number(iFilaHasta);
                    var iColumnaT = letraANumero(letraDesde);
                    var iColumnaHasta = letraANumero(letraHasta);
                    while(iColumnaT<=iColumnaHasta && iFilaT<=iFilaHasta){
                        var cell = sheet[numeroALetra(iColumnaT)+iFilaT];
                        valores.push(cell.v);
                        iColumnaT+=delta.columna;
                        iFilaT+=delta.fila;
                    }
                }else{
                    valores = fuenteValores.replace(/['"\r\n]/g,'').split(/\s*;\s*/g);
                }
                var tuplas = valores.map(function(valor, i){
                    valoresDecididos[campoDef.columna]=typeof valor==='string'?valor.trim():valor;
                    if(iCampo==campos.length-1){
                        var direccion = numeroALetra(iColumnaV+iColumna+i*delta.columna)+(iFilaV+iFila+i*delta.fila);
                        var celda = sheetV[direccion];
                        if(celda && celda.v!=null && (typeof celda.v!=='string' || !regExpDescartarValor.test(celda.v))){
                            var tupla = clone(valoresDecididos);
                            tupla.valor = celda.v;
                            valoresFinales.push(tupla);
                        }else{
                            ///// console.log('xxxxxxxxxxxx',direccion, iColumnaV, i, delta.columna, iFilaV, i, delta.fila, sheetV);
                        }
                    }else{
                        procesarCampo(valoresFinales, valoresDecididos, iCampo+1, iFila+i*delta.fila, iColumna+i*delta.columna);
                    }
                });
            }
            var valoresFinales=[];
            var valoresDecididos={
                id_carpeta: serieDef.id_carpeta,
                archivo   : serieDef.archivo   ,
                renglon   : serieDef.renglon   ,
            };
            // console.log('xxxxxxxxxxxxxxxx decidi2 ', valoresDecididos);
            procesarCampo(valoresFinales, valoresDecididos, 0, 0, 0);
            return valoresFinales;
        });
    }).then(function(result){
        result=[].concat.apply([],result);
        // console.log('===========',opts.path);
        // console.log(result);
        // console.log('---------');
        return result;
    }).catch(function(err){
        console.log(err);
        console.log(err.stack);
    });
}

module.exports = importador