// requires
const log = require('bristol');
// constantes funciones
const funciones = require('./funciones.js');
// constantes filenames
const file_log       = "./logs.txt";

module.exports = {

    logs: function(msg, comando){
        console.log("Comando "+comando);
        const log_info = `El comando `+comando+` ha recibido el dato del chat: \n{\nid: ${msg.chat.id}\ntype: ${msg.chat.type}\ntext: ${msg.text}\nusername: ${msg.chat.username}\nfirst_name: ${msg.chat.first_name}\n}\n`
        log.info(log_info, { scope: comando });
        funciones.writeFile(file_log, log_info);
    }
}