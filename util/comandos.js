const mongo = require('mongodb');
// operaciones db
const logs = require('./logs.js');
// constantes funciones
const funciones = require('./funciones.js');
// constantes listas/arrays
const listas = require('./listas.js');
const command = listas.arrayCommands();
const commandHelp = listas.listCommandHelp();
const CHECK = '✅', EQUIS = '❌', ARROW = '➡️', HANDS = '🙌', STOP = '✋', REPEAT = '🔂', SAD = '😥', CAN = '💪';

module.exports = {

    commandStart: function(msg, comando){
        logs.logs(msg, comando);
        let first_name = msg.chat.first_name;
        let uid = funciones.knownUsers(msg.chat.id);
        let response = "";
        if( uid == 0)
            response = "Bienvenido "+first_name+".\nEste es un chat para practicar preguntas sobre la oposición de TAI "+CAN+"\nAprende constestando las preguntas y tienes la opción de ver youtube (@youtube) y de realizar las búsquedas en la wikipedia (@wiki).\nPara ver los comandos de este puedes escribir "+command[1]+"."
        else
            response = "Ya te conozco, eres "+first_name+".\nPara ver los comandos "+ARROW+" "+command[1]+"." 
        return response;
    },

    commandHelp: function(msg, comando){
        logs.logs(msg, comando);
        let response = "Comandos disponibles para este bot: \n" 
        for (key in commandHelp)  // generate help text out of the commands dictionary defined at the top 
            response += "/"+key +' : '+commandHelp[key]+"\n"
        return response;   
    },

    callbackQuery: function(msg, data, datos_score, datos, accion, comando){
        logs.logs(msg, comando);
        let user_answer = funciones.getRespuestaUser(data);
        let response = '', emoji = '';
        if( user_answer != ''){
            if( user_answer === datos[1]){ emoji = CHECK; } else { emoji = EQUIS; }
            datos_score = funciones.calcularScore(datos_score, datos[1], user_answer);
            response += '<b>Enunciado</b>: "'+datos[0]+'"\n\nTu respuesta: <b>'+user_answer+'</b>   '+emoji+'\n<b>Respuesta correcta: '+datos[1]+'</b>\n\n'
            response += CHECK+" <b>Correctas</b>: "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\n";
            console.log("accion: "+accion);

            if( accion === '')
                accion = command[2]+" o "+command[3]+" o "+command[4]+" o "+command[5]+" o "+command[6]+" o "+command[8]+" o "+command[9]+" o "+command[10];
            response += REPEAT+" Empezar o <b>seguir</b> "+ARROW+" "+accion+".\n"
            response += STOP+" <b>Parar</b> el test "+ARROW+" "+command[12]+"."
        }

        return response;
    },

    createCallbackObject: function(msg, data, accion, preg, datos, tipo_respuesta){

        let hoy = funciones.getFecha();
        let time = funciones.getHora();

        let ObjectID = mongo.ObjectID;
        let doc = { "_id": new ObjectID(), "user": msg.chat.username, "accion": accion, "bloque": preg[0], "tema": preg[2], "autor": preg[1], "enunciado": datos[0], "resp_correcta": datos[1], "resp_user": data, "tipo_respuesta": tipo_respuesta, "fecha": hoy+" "+time.toString()  };
        //console.log("doc: "+ JSON.stringify(doc));
        return doc;
    },

    commandTest: function(msg, comando){
        logs.logs(msg, comando);
        let response = "Has elegido realizar un test personalizado. "+HANDS+" \n" 
        return response;   
    },

    commandTestInap: function(msg, comando){
        logs.logs(msg, comando);
        let response = "Has elegido realizar un test de INAP. "+HANDS+" \n" 
        return response;   
    },

    commandTema: function(msg, comando){
        logs.logs(msg, comando);
        let response = "Has elegido realizar un test personalizado por tema. "+HANDS+" \n" 
        return response;
    },

    commandStop: function(msg, datos_score, accion, search_autor, search_bloque, search_tema, comando){
        logs.logs(msg, comando);
        let response = '';
        let contador = 0, porcentaje = 0, incorrectos = 0, total = 0;
        console.log("commandStop -> search_tema: "+search_tema);
        if( datos_score[0] > 0 || datos_score[1] > 0 ){
            contador = datos_score[0]+datos_score[1];
            if( datos_score[0] === 0){
                porcentaje = 0.00;
            }
            else{
                incorrectos = datos_score[1] * 0.33;
                console.log("incorrectos: "+incorrectos);
                total = datos_score[0] - incorrectos;
                console.log("total: "+total);
                porcentaje = (total * 100 / contador).toFixed(2);
            }
            if (  accion == command[3] | accion == command[4] | accion == command[5] | accion == command[6]  ){ //bloques
    
                let b = accion.substring(accion.length-1);
                response = "De las <b>"+contador.toString()+"</b> preguntas del <b>bloque "+b+"</b>:\n\n"+CHECK+" <b>Correctas</b> : "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\nCon el porcentaje: "+porcentaje.toString()+"%.\n"
            }
            else if ( accion == command[7] | accion == command[8] | accion == command[9] | accion == command[10] | accion == command[11] ){ //years
                let anio = accion.substring(1,accion.length);
                response = "De las <b>"+contador.toString()+"</b> preguntas del <b>año "+anio+"</b>:\n\n"+CHECK+" <b>Correctas</b> : "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\nCon el porcentaje: "+porcentaje.toString()+"%.\n"
            }
            else if ( accion == command[15] | accion == command[16] | accion == command[17] | accion == command[18] 
                    | accion == command[19] | accion == command[20] | accion == command[21] | accion == command[22]
                    | accion == command[23] | accion == command[24] | accion == command[27] ){ //test personalizados
                console.log("search tema"+search_tema)
                if( search_tema === undefined){
                    response = "De las <b>"+contador.toString()+"</b> preguntas del <b>autor "+search_autor+"</b>:\n\n"+CHECK+" <b>Correctas</b> : "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\nCon el porcentaje: "+porcentaje.toString()+"%.\n"
                }
                else if( search_tema !== undefined){
                    response = "De las <b>"+contador.toString()+"</b> preguntas del <b>autor "+search_autor+" y tema "+search_tema+"</b>:\n\n"+CHECK+" <b>Correctas</b> : "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\nCon el porcentaje: "+porcentaje.toString()+"%.\n"
                }
                
            }
            else if ( accion == command[26]) { // blocXtema
                response = "De las <b>"+contador.toString()+"</b> preguntas del <b>bloque "+search_bloque+" y tema "+search_tema+"</b>:\n\n"+CHECK+" <b>Correctas</b> : "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\nCon el porcentaje: "+porcentaje.toString()+"%.\n"
            }
            else
                response = "De las <b>"+contador.toString()+"</b> preguntas.\n\n"+CHECK+" <b>Correctas</b> : "+datos_score[0].toString()+".\n"+EQUIS+" <b>Incorrectas</b>: "+datos_score[1].toString()+".\n\nCon el porcentaje: "+porcentaje.toString()+"%.\n"
        }
        else{
            accion = command[2]+", "+command[3]+", "+command[4]+", "+command[5]+", "+command[6]+", "+command[7]+", "+command[8]+", "+command[9]+", "+command[10]+", "+command[25]+" o "+command[14];
            response = "No hay puntuación "+SAD+"\nNo has respondido o has terminado.\n\n";
            response += "Empezar el test "+ARROW+" "+accion+" y después elegir alguna opción.";
        }

        return response;
    },

    createStopObject: function(msg){

        let hoy = funciones.getFecha();
        let time = funciones.getHora();
        let ObjectID = mongo.ObjectID;
        let doc = { "_id": new ObjectID(), "user": msg.chat.username, "accion": "/stop", "bloque": "", "autor": "", "enunciado": "", "resp_correcta": "", "resp_user": "", "tipo_respuesta": "", "fecha": hoy+" "+time.toString()  };
        //console.log("doc: "+ JSON.stringify(doc));
        return doc;
    },

    commandWiki: function(msg, search, comando){
        logs.logs(msg, comando);
        let response = ''; let lang = msg.from.language_code;
        console.log("language code: "+lang);
        if( search.length > 0 ){
            idioma = search.substring(0,2);
            idioma = idioma.toLowerCase(); console.log("idioma: "+idioma);
            if( funciones.findIdiomas(idioma) ){
                if( idioma !== undefined || idioma !== '' || idioma != lang ){ lang = idioma; search = search.substring(2);  }
                search = search.trim();
                search = funciones.replaceSpace(search,"_");
                console.log("search: "+search);
                if( idioma !== undefined || idioma !== ''){ response = "https://"+idioma+".wikipedia.org/wiki/"+search }
                else { response = "https://"+lang+".wikipedia.org/wiki/"+search }
            }
            else {
                let text = search.substring(0,3);
                let espacio = text.substring(2);
                if( espacio === ' '){
                    search = search.substring(2);
                    search = search.trim();
                    search = funciones.replaceSpace(search,"_");
                    response = "https://"+lang+".wikipedia.org/wiki/"+search
                }
                else {
                    search = search.trim();
                    search = funciones.replaceSpace(search,"_");
                    response = "https://"+lang+".wikipedia.org/wiki/"+search
                } 
            }
        }

        return response;
    },

    commandLangWiki: function(msg, comando){
        logs.logs(msg, comando, comando);
        let response = "Has elegido realizar una búsqueda en la wikipedia.\n" 
        return response;   
    },

    createSearchObject: function(msg, response){

        let hoy = funciones.getFecha();
        let time = funciones.getHora();
        let ObjectID = mongo.ObjectID;
        let doc = { "_id": new ObjectID(), "user": msg.chat.username, "url": response, "fecha": hoy+" "+time.toString()  };
        //console.log("doc: "+ JSON.stringify(doc));
        return doc;
    },

    commandDefault: function(msg, selected, comando){
        logs.logs(msg, comando);
        let response = '';
        if( msg.text !== undefined){

            texto = msg.text.toString();
            comando = texto;
            comando = comando.trim();
            comando_wiki = texto.substring(0, 6);
            comando_wiki = comando_wiki.trim().toLowerCase();
            search = texto.substring(5, texto.length);
            
            console.log("texto: "+texto);
            console.log("comando: "+comando);
            console.log("comando wiki: "+comando_wiki);
            console.log("search: "+search);

            if(selected !== undefined)
                for(var i=0;i<selected.length;i++){ console.log("selected "+i+": "+selected[i]); }

            if ( !funciones.findCommnad(comando) & !funciones.findCommnad(comando_wiki) & comando === 'https:' ){ // si no es ningun comando

                if ( !funciones.findAutores(texto) & !funciones.findBloques(texto) & !funciones.findYears(texto) & !funciones.findPromociones(texto) & !funciones.findTemas(texto) ){ // si no es ningun autor o bloque o promocion
                    response = "No te entiendo \"" +texto+ "\"\nPuedes escribir el comando "+command[1]+" para saber qué comando utilizar."
                }
            }
            else{
    
                if ( funciones.findCommnad(comando_wiki) ){ // si es el comando wiki
        
                    if( comando_wiki === command[13] ){
                        if (search.length === 0)
                            response = "No has puesto nada después de "+command[13]+" para buscarlo."
                    }
                    
                }
                /*
                else{
                    response = "No existe el comando en este bot. Para ello puedes escribir /help.";
                }*/
            }
        }
        else{
            response = "Si necesita ayuda puedes escribir "+command[1]+".";
        }

        return response;
    }

}