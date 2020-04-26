// requires
const log = require('bristol');
const mongo = require('mongodb');

// constantes funciones
const funciones = require('./funciones.js');

// constantes listas/arrays
const listas = require('./listas.js');
const command = listas.arrayCommands();

// constantes filenames
const file_log       = "./logs.txt";

module.exports = {

    logStart: function(msg){
        console.log("Comando "+command[0])
        const log_info = `El comando `+command[0]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[0] });
        funciones.writeFile(file_log, log_info);
    },

    logHelp: function(msg){
        console.log("Comando "+command[1])
        const log_info = `El comando `+command[1]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[1] });
        funciones.writeFile(file_log, log_info);
    },

    logQuiz: function(msg){
        console.log("Comando "+command[2]);
        const log_info = `El comando `+command[2]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[2] });
        funciones.writeFile(file_log, log_info);
    },

    logBloque: function(msg){
        let comando = msg.text.toString();
        console.log("comando "+comando);
        const log_info = `El comando `+comando+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: comando });
        funciones.writeFile(file_log, log_info);
    },

    logYear: function(msg){
        let comando = msg.text.toString();
        console.log("comando "+comando);
        const log_info = `El comando `+comando+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: comando });
        funciones.writeFile(file_log, log_info);
    },

    logCallback: function(msg){
        console.log("callback_query");
        const log_info = `El callback_query ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: 'callback_query' });
        funciones.writeFile(file_log, log_info);
    },

    logTest: function(msg){
        console.log("Comando "+command[14])
        const log_info = `El comando `+command[14]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[14] });
        funciones.writeFile(file_log, log_info);
    },

    logTestInap: function(msg){
        console.log("Comando "+command[15])
        const log_info = `El comando `+command[15]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[15] });
        funciones.writeFile(file_log, log_info);
    },

    logStop: function(msg){
        console.log("Comando "+command[12])
        const log_info = `El comando `+command[12]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[12] });
        funciones.writeFile(file_log, log_info);
    },

    logWiki: function(msg){
        console.log("Comando "+command[13])
        const log_info = `El comando `+command[13]+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: command[13] });
        funciones.writeFile(file_log, log_info);
    },

    logDefault: function(msg){
        console.log("Comando default")
        const log_info = `El comando default ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: 'default' });
        funciones.writeFile(file_log, log_info);
    }

}