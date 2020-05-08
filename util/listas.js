// constantes funciones
const funciones = require('./funciones.js');

// listas
module.exports = {

    listCommandHelp: function() {

        commands = {  // command description used in the "help" command 
            'start'       : 'Bienvenido al chatbot', 
            'help'        : 'Esta instrucción informa sobre los comandos de este bot',
            'quiz'        : 'Empezar el test',
            'b1'          : 'Test bloque 1 - Legislacion.',
            'b2'          : 'Test bloque 2 - Tecnología básica.',
            'b3'          : 'Test bloque 3 - Programación.',
            'b4'          : 'Test bloque 4 - Sistemas.',
            '2014'        : 'Test 2014 INAP',
            '2015'        : 'Test 2015 INAP',
            '2016'        : 'Test 2016 INAP',
            '2017'        : 'Test 2017 INAP',
            '2018'        : 'Test 2018 INAP',
            'test'        : 'Test personalizado.',
            'stop'        : 'Se para el test y te da un resumen de tu puntuación.',
            'wiki'        : 'Busca información en la wikipedia en castellano.'
        }
        
        return commands;
    },

    listCommand: function() {

        commands = {
            'start'       : 'Bienvenido al chatbot', 
            'help'        : 'Esta instrucción informa sobre los comandos de este bot',
            'quiz'        : 'Empezar el test',
            'b1'          : 'Test bloque 1 - Legislacion.',
            'b2'          : 'Test bloque 2 - Tecnología básica.',
            'b3'          : 'Test bloque 3 - Programación.',
            'b4'          : 'Test bloque 4 - Sistemas.',
            '2014'        : 'Test 2014 INAP',
            '2015'        : 'Test 2015 INAP',
            '2016'        : 'Test 2016 INAP',
            '2017'        : 'Test 2017 INAP',
            '2018'        : 'Test 2018 INAP',
            'test'        : 'Test personalizado.',
            'stop'        : 'Se para el test y te da un resumen de tu puntuación.',
            'wiki'        : 'Busca información en la wikipedia en castellano.',
            'inap'        : 'Test del INAP personalido.',
            'emilio'      : 'Test del Emilio personalido.',
            'adams'       : 'Test del Adams personalido.',
            'gokoan'      : 'Test del Gokoan personalido.',
            'oposapiens'  : 'Test del Oposapiens personalido.',
            'searches'    : 'Busquedas wiki.',
            'opositatest' : 'Test del OpositaTest personalido.',
            'daypo'       : 'Test del Daypo personalido.',
            'preparatic'  : 'Test del Daypo personalido.'
        }
        
        return commands;
    },

    listAutores: function(){

        const autores = ["INAP",        //0
                        "Emilio",       //1
                        "Adams",        //2
                        "Gokoan",       //3
                        "OpoSapiens",   //4
                        "OpositaTest",  //5
                        "Daypo",        //6
                        "PreparaTic"    //7
                        ];

        return autores;

    },

    listBloques: function(){

        const bloques = ["B1","B2","B3","B4"];

        return bloques;
    },

    listYears: function(){

        const years = ["2014","2015","2016","2017","2018"];

        return years;
    },

    listPromociones: function(){

        const years = ["PI","LI"];

        return years;
    },

    getKeyboard: function(){

        const OPCION_A = 'a'
        const OPCION_B = 'b'
        const OPCION_C = 'c'
        const OPCION_D = 'd'

        keyboard = {"inline_keyboard": 
                        [[
                            {
                                "text": OPCION_A,
                                "callback_data": OPCION_A            
                            }, 
                            {
                                "text": OPCION_B,
                                "callback_data": OPCION_B            
                            },
                                            {
                                "text": OPCION_C,
                                "callback_data": OPCION_C            
                            },
                                            {
                                "text": OPCION_D,
                                "callback_data": OPCION_D            
                            }
                        ]]
                    }

        return keyboard;
    },

    arrayCommands: function(){

        let array_commands = [  "/start",   //0
                                "/help",    //1
                                "/quiz",    //2
                                "/b1",      //3
                                "/b2",      //4
                                "/b3",      //5
                                "/b4",      //6
                                "/2014",    //7
                                "/2015",    //8
                                "/2016",    //9
                                "/2017",    //10
                                "/2018",    //11
                                "/stop",    //12
                                "/wiki",    //13
                                "/test",    //14
                                "/inap",    //15
                                "/emilio",  //16
                                "/adams",   //17
                                "/gokoan",   //18
                                "/oposapiens",//19
                                "/searches",  //20
                                "/opositatest",//21
                                "/daypo",      //22
                                "/preparatic"  //23
                            ];

        return array_commands;

    },

    getTestKeyboardAutores: function() {
        
        filas = 3;
        columnas = 3
        autores = this.listAutores();
        numAutores = autores.length; //autorXfila = Math.trunc(numAutores/filas);
        autorFila0 = [];
        autorFila1 = [];
        autorFila2 = [];

        for(var i=0;i<columnas;i++){ //console.log("autor: "+autores[i]);
            autorFila0.push(autores[i]);
        }
        for(var i=columnas;i<(columnas*2);i++){ //console.log("autor: "+autores[i]);
            autorFila1.push(autores[i]);
        }
        //for(var i=columnas*2;i<(columnas*3);i++){
        for(var i=columnas*2;i<numAutores;i++){
            autorFila2.push(autores[i]);
        }
        keyboard = [ autorFila0, autorFila1, autorFila2 ];

        let keyboard_autores = {
                                "reply_markup": {
                                                //"keyboard": [this.listAutores()],
                                                "keyboard": [ keyboard[0], keyboard[1], keyboard[2] ],
                                                "one_time_keyboard": true
                                                }
                                };
        return keyboard_autores;

    },

    getTestKeyboardBloques: function(){

        let keyboard_bloques = { "reply_markup": { "keyboard": [this.listBloques()], "one_time_keyboard": true } };

        return keyboard_bloques;
    },

    getTestKeyboardYears: function(){

        let keyboard_years = { "reply_markup": { "keyboard": [this.listYears()], "one_time_keyboard": true } };

        return keyboard_years;
    },

    getTestKeyboardPromocion: function(){

        let keyboard_promocion = { "reply_markup": { "keyboard": [this.listPromociones()], "one_time_keyboard": true } };

        return keyboard_promocion;
    },

    getTestKeyboardBlank: function(){

        //let keyboard_blank = { "reply_markup": { "keyboard": [], "one_time_keyboard": true } };

        let keyboard_blank = { "reply_markup": { "remove_keyboard": true } };

        return keyboard_blank;

    },

    getTestKeyboardBlank2: function(){

        let keyboard_blank = { "keyboard": [], "one_time_keyboard": true };

        return keyboard_blank;

    }
}
