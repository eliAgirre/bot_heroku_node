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

module.exports = {

    commandStart: function(msg){
        logs.logStart(msg);
        let first_name = msg.chat.first_name;
        let uid = funciones.knownUsers(msg.chat.id);
        let response = "";
        if( uid == 0)
            response = "Bienvenido "+first_name+".\nEste es un chat para practicar preguntas sobre la oposición de TAI.\nAprende constestando las preguntas y tienes la opción de ver youtube (@youtube) y de realizar las búsquedas en la wikipedia (@wiki).\nPara ver los comandos de este puedes escribir "+command[1]+"."
        else
            response = "Ya te conozco, eres "+first_name+".\nPara ver los comandos puedes escribir "+command[1]+"." 
        return response;
    },

    commandHelp: function(msg){
        logs.logHelp(msg);
        let response = "Los siguientes comando están disponibles para este bot: \n" 
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
            response += "El enunciado ha sido: "+datos[0]+"\nTu respuesta ha sido la *"+user_answer+"*.\n*La respuesta correcta es: "+datos[1]+"*\n\n"
            response += "Respuestas *correctas*: "+datos_score[0].toString()+".\nRespuestas *incorrectas*: "+datos_score[1].toString()+".\n\n";
            console.log("accion: "+accion);

            if( accion === '')
                accion = command[2]+" o "+command[3]+" o "+command[4]+" o "+command[5]+" o "+command[6]+" o "+command[8]+" o "+command[9]+" o "+command[10];
            response += "Para empezar o seguir el test puedes escribir el comando "+accion+".\n"
            response += "Para parar el test puedes escribir el comando "+command[12]+"."
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
        let response = "Has elegido realizar un test personalizado. \n" 
        return response;   
    },

    commandTestInap: function(msg){
        logs.logTest(msg);
        let response = "Has elegido realizar un test personalizado. \n" 
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
                response = "De las *"+contador.toString()+"* preguntas del *bloque "+b+"*.\nRespuestas *correctas* : "+datos_score[0].toString()+".\nRespuestas *incorrectas*: "+datos_score[1].toString()+".\n"
            }
            else if ( accion == command[7] | accion == command[8] | accion == command[9] | accion == command[10] | accion == command[11] ){ //years
                let anio = accion.substring(1,accion.length);
                response = "De las *"+contador.toString()+"* preguntas del *año "+anio+"*.\nRespuestas *correctas* : "+datos_score[0].toString()+".\nRespuestas *incorrectas*: "+datos_score[1].toString()+".\n"
            }
            else if ( accion == command[15] ){ //test personalizados
                response = "De las *"+contador.toString()+"* preguntas del *autor "+search_autor+"*.\nRespuestas *correctas* : "+datos_score[0].toString()+".\nRespuestas *incorrectas*: "+datos_score[1].toString()+".\n"
            }
            else
                response = "De las *"+contador.toString()+"* preguntas.\nRespuestas *correctas* : "+datos_score[0].toString()+".\nRespuestas *incorrectas*: "+datos_score[1].toString()+".\n"
        }
        else{
            accion = command[2]+" o "+command[3]+" o "+command[4]+" o "+command[5]+" o "+command[6]+" o "+command[8]+" o "+command[9]+" o "+command[10]+" o "+command[14];
            response = "No hay puntuación, ya que no has respondido al test o ya habías terminado.\nPara empezar hacer el test puedes escribir el comando "+accion+" y después hacer clic en alguna de las opciones correspondientes."
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
        let response = ''
        if( search.length > 0 ){
            search = search.trim();
            search = funciones.replaceSpace(search,"_");
            console.log("search: "+search);
            response = "https://es.wikipedia.org/wiki/"+search
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

        if ( !funciones.findCommnad(comando) ){ // si no es ningun comando

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
        }

        return response;
    }

}