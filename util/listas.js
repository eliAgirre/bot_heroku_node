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
            'preparatic'  : 'Test del Daypo personalido.',
            'opostestic'  : 'Test del OposTestTic personalido.'
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
                        "PreparaTic",   //7
                        "OposTestTic"   //8
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
    
    listIdiomas: function(){

        const idioma = ["es","en","fr","pt","eu","ca","gl","an","ast"];

        return idioma;
    },

    objectIdioma: function(){

        var idioma = { "es" : "Español", "en" : "Inglés", "fr": "Francés", "pt" : "Portugués", "eu" : "Euskara", "ca": "Català", "gl": "Gallego", "an": "Aragonés", "ast": "Asturiano" };

        return idioma;

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
                                "/preparatic", //23
                                "/opostestic" //24
                            ];

        return array_commands;

    },

    getTestKeyboardAutores: function() {
        
        let columnas = 3;
        let autores = this.listAutores(); // let filas = 3; numAutores = autores.length; autorXfila = Math.trunc(numAutores/filas);
        let autorXfila = [];
        let keyboard = [];
        let keyboard_autores = {};

        for(var i=0; i<=autores.length; i++){
            if (autores[i] !== undefined){
                autorXfila.push(autores[i]);
            }
            if( i > 0){
                if( (i+1) % columnas == 0){
                    keyboard.push(autorXfila);
                    autorXfila = [];
                }
            }
        }

        keyboard_autores = {
                            "reply_markup": {
                                "keyboard": keyboard, //"keyboard": [this.listAutores()],
                                "one_time_keyboard": true
                            }};

        return keyboard_autores;

    },

    getTestKeyboardBloques: function(){

        let keyboard_bloques = { "reply_markup": { "keyboard": [this.listBloques()], "one_time_keyboard": true } };

        return keyboard_bloques;
    },

    getTestKeyboardYears: function(){

        let columnas = 3;
        let years = this.listYears();
        let yearXfila = [];
        let keyboard = [];
        let keyboard_years = {};

        for(var i=0; i<=years.length; i++){
            if (years[i] !== undefined){
                yearXfila.push(years[i]);
            }
            if( i > 0){
                if( (i+1) % columnas == 0){
                    keyboard.push(yearXfila);
                    yearXfila = [];
                }
            }
        }

        keyboard_years  =   {
                            "reply_markup": { //"keyboard": [this.listYears()],
                                "keyboard": keyboard,
                                "one_time_keyboard": true
                            }}

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

    },

    getKeyboardIdioma: function(){

        const ES = 'es'
        const EN = 'en'
        const FR = 'fr'
        const PT = 'pt'

        keyboard = {"inline_keyboard": 
                        [[
                            {
                                "text": 'Español',
                                "callback_data": ES            
                            }, 
                            {
                                "text": 'Inglés',
                                "callback_data": EN            
                            },
                                            {
                                "text": 'Francés',
                                "callback_data": FR            
                            },
                                            {
                                "text": 'Portugués',
                                "callback_data": PT            
                            }
                        ]]
                    }

        return keyboard;
    }
}
