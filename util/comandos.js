const mongo = require('mongodb');
// operaciones db
const logs = require('./logs.js');
// constantes funciones
const funciones = require('./funciones.js');
// constantes listas/arrays
const listas = require('./listas.js');
const commands = listas.listCommand();
const command = listas.arrayCommands();
const commandHelp = listas.listCommandHelp();
const CHECK = '✅', EQUIS = '❌', ARROW = '➡️', HANDS = '🙌', STOP = '✋', REPEAT = '🔂', SAD = '😥', CAN = '💪';

module.exports = {

    commandStart: function(msg){
        logs.logStart(msg);
        let first_name = msg.chat.first_name;
        let uid = funciones.knownUsers(msg.chat.id);
        let response = "";
        if( uid == 0)
            response = "Bienvenido "+first_name+".\nEste es un chat para practicar preguntas sobre la oposición de TAI "+CAN+"\nAprende constestando las preguntas y tienes la opción de ver youtube (@youtube) y de realizar las búsquedas en la wikipedia (@wiki).\nPara ver los comandos de este puedes escribir "+command[1]+"."
        else
            response = "Ya te conozco, eres "+first_name+".\nPara ver los comandos "+ARROW+" "+command[1]+"." 
        return response;
    },

    commandHelp: function(msg){
        logs.logHelp(msg);
        let response = "Comandos disponibles para este bot: \n" 
        for (key in commandHelp)  // generate help text out of the commands dictionary defined at the top 
            response += "/"+key +' : '+commandHelp[key]+"\n"
        return response;   
    },

    callbackQuery: function(msg, data, datos_score, datos, accion){
        logs.logCallback(msg);
        let user_answer = funciones.getRespuestaUser(data);
        let response = '';
        if( user_answer != ''){

            datos_score = funciones.calcularScore(datos_score, datos[1], user_answer);
            response += '*Enunciado*: "'+datos[0]+'"\nTu respuesta: *'+user_answer+'*.\n*Respuesta correcta: '+datos[1]+'*\n\n'
            response += CHECK+" *Correctas*: "+datos_score[0].toString()+".\n"+EQUIS+" *Incorrectas*: "+datos_score[1].toString()+".\n\n";
            console.log("accion: "+accion);

            if( accion === '')
                accion = command[2]+" o "+command[3]+" o "+command[4]+" o "+command[5]+" o "+command[6]+" o "+command[8]+" o "+command[9]+" o "+command[10];
            response += REPEAT+" Empezar o *seguir* "+ARROW+" "+accion+".\n"
            response += STOP+" *Parar* el test "+ARROW+" "+command[12]+"."
        }

        return response;
    },

    createCallbackObject: function(msg, data, accion, preg, datos, tipo_respuesta){

        let hoy = funciones.getFecha();
        let time = funciones.getHora();

        let ObjectID = mongo.ObjectID;
        let doc = { "_id": new ObjectID(), "user": msg.chat.username, "accion": accion, "bloque": preg[0], "autor": preg[1], "enunciado": datos[0], "resp_correcta": datos[1], "resp_user": data, "tipo_respuesta": tipo_respuesta, "fecha": hoy+" "+time.toString()  };
        //console.log("doc: "+ JSON.stringify(doc));
        return doc;
    },

    commandTest: function(msg){
        logs.logTest(msg);
        let response = "Has elegido realizar un test personalizado. "+HANDS+" \n" 
        return response;   
    },

    commandTestInap: function(msg){
        logs.logTest(msg);
        let response = "Has elegido realizar un test de INAP. "+HANDS+" \n" 
        return response;   
    },

    commandStop: function(msg, datos_score, accion, search_autor){
        logs.logStop(msg);
        let response = '';
        let contador = 0;

        if( datos_score[0] > 0 || datos_score[1] > 0 ){
            contador = datos_score[0]+datos_score[1];
            if (  accion == command[3] | accion == command[4] | accion == command[5] | accion == command[6]  ){ //bloques
    
                let b = accion.substring(accion.length-1);
                response = "De las *"+contador.toString()+"* preguntas del *bloque "+b+"*:\n\n"+CHECK+" *Correctas* : "+datos_score[0].toString()+".\n"+EQUIS+" *Incorrectas*: "+datos_score[1].toString()+".\n"
            }
            else if ( accion == command[7] | accion == command[8] | accion == command[9] | accion == command[10] | accion == command[11] ){ //years
                let anio = accion.substring(1,accion.length);
                response = "De las *"+contador.toString()+"* preguntas del *año "+anio+"*:\n\n"+CHECK+" *Correctas* : "+datos_score[0].toString()+".\n"+EQUIS+" *Incorrectas*: "+datos_score[1].toString()+".\n"
            }
            else if ( accion == command[15] | accion == command[16] | accion == command[17] | accion == command[18] 
                    | accion == command[19] | accion == command[20] | accion == command[21] | accion == command[22]
                    | accion == command[23] | accion == command[24] ){ //test personalizados
                response = "De las *"+contador.toString()+"* preguntas del *autor "+search_autor+"*:\n\n"+CHECK+" *Correctas* : "+datos_score[0].toString()+".\n"+EQUIS+" *Incorrectas*: "+datos_score[1].toString()+".\n"
            }
            else
                response = "De las *"+contador.toString()+"* preguntas.\n\n"+CHECK+" *Correctas* : "+datos_score[0].toString()+".\n"+EQUIS+" *Incorrectas*: "+datos_score[1].toString()+".\n"
        }
        else{
            accion = command[2]+", "+command[3]+", "+command[4]+", "+command[5]+", "+command[6]+", "+command[8]+", "+command[9]+", "+command[10]+" o "+command[14];
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

   commandWiki: function(msg, search){
       
        logs.logWiki(msg);
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

    createSearchObject: function(msg, response){

        let hoy = funciones.getFecha();
        let time = funciones.getHora();
        let ObjectID = mongo.ObjectID;
        let doc = { "_id": new ObjectID(), "user": msg.chat.username, "url": response, "fecha": hoy+" "+time.toString()  };
        //console.log("doc: "+ JSON.stringify(doc));
        return doc;
    },

    commandDefault: function(msg){
        logs.logDefault(msg);
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

            if ( !funciones.findCommnad(comando) & !funciones.findCommnad(comando_wiki) & comando === 'https:' ){ // si no es ningun comando

                if ( !funciones.findAutores(texto) & !funciones.findBloques(texto) & !funciones.findYears(texto) & !funciones.findPromociones(texto) ){ // si no es ningun autor o bloque o promocion
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
            response = "Si necesita ayuda puedes escribir /help.";
        }

        return response;
    }

}