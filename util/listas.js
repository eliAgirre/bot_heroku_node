// constantes funciones
const funciones = require('./funciones.js');

// listas
module.exports = {

    listCommandHelp: function() {

        commands = {  // command description used in the "help" command 
            'start'       : 'Bienvenido al chatbot o reinicio.', 
            'help'        : 'Esta instrucción informa sobre los comandos de este bot.',
            'quiz'        : 'Empezar el test.',
            'b1'          : 'Test bloque 1 - Legislacion.',
            'b2'          : 'Test bloque 2 - Tecnología básica.',
            'b3'          : 'Test bloque 3 - Programación.',
            'b4'          : 'Test bloque 4 - Sistemas.',
            '2014'        : 'Test 2014 INAP.',
            '2015'        : 'Test 2015 INAP.',
            '2016'        : 'Test 2016 INAP.',
            '2017'        : 'Test 2017 INAP.',
            '2018'        : 'Test 2018 INAP.',
            'tema'        : 'Test por tema.',
            'test'        : 'Test personalizado.',
            'failed'      : 'Test preguntas falladas.',
            'stop'        : 'Se para el test y te da un resumen de tu puntuación.',
            'wiki'        : 'Busca información en la wikipedia en castellano.',
            'wiki en'     : 'Busca información en la wikipedia en inglés.',
            'examen'      : 'Examen de lo que desees. Por ejemplo: css o ce.'
        }
        
        return commands;
    },

    listCommand: function() {

        commands = {
            'start'        : 'Bienvenido al chatbot o reinicio.', 
            'help'         : 'Esta instrucción informa sobre los comandos de este bot.',
            'quiz'         : 'Empezar el test.',
            'b1'           : 'Test bloque 1 - Legislacion.',
            'b2'           : 'Test bloque 2 - Tecnología básica.',
            'b3'           : 'Test bloque 3 - Programación.',
            'b4'           : 'Test bloque 4 - Sistemas.',
            '2014'         : 'Test 2014 INAP.',
            '2015'         : 'Test 2015 INAP.',
            '2016'         : 'Test 2016 INAP.',
            '2017'         : 'Test 2017 INAP.',
            '2018'         : 'Test 2018 INAP.',
            'test'         : 'Test personalizado.',
            'stop'         : 'Se para el test y te da un resumen de tu puntuación.',
            'wiki'         : 'Busca información en la wikipedia en castellano.',
            'inap'         : 'Test del INAP personalizado.',
            'emilio'       : 'Test del Emilio personalizado.',
            'adams'        : 'Test del Adams personalizado.',
            'gokoan'       : 'Test del Gokoan personalizado.',
            'oposapiens'   : 'Test del Oposapiens personalizado.',
            'searches'     : 'Busquedas wiki.',
            'opositatest'  : 'Test del OpositaTest personalizado.',
            'daypo'        : 'Test del Daypo personalizado.',
            'preparatic'   : 'Test del Daypo personalizado.',
            'opostestic'   : 'Test del OposTestTic personalizado.',
            'tema'         : 'Test del tema.',
            'opolex'       : 'Test del Opolex personalizado.',
            'funcionaTest' : 'Test del FuncionaTest personalizado.',
            'failed'       : 'Test sobre preguntas falladas.',
            'examen'       : 'Examen de lo que desees. Por ejemplo: css o ce.'
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
                        "Opolex",       //8
                        "OposTestTic",  //9
                        "FuncionaTest"  //10
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

    listSiNo: function(){

        const bloques = ["SI","NO"];

        return bloques;
    },

    listTemas: function(){

        const temas = ["T01","T02","T03","T04","T05","T06","T07","T08","T09","T10","T11"];

        return temas;
    },

    listIdiomas: function(){

        const idioma = ["es","en","fr","pt","eu","ca","gl","an","ast"];

        return idioma;
    },

    getListArray: function(){

        const arrayList =  ["db_questions",         //0
                            "preguntasBlocXTema",   //1
                            "preguntasBloque",      //2
                            "preguntasAnio",        //3
                            "questPersonalized",    //4
                            "OpositaTest",          //5
                            "Daypo",                //6
                            "PreparaTic",           //7
                            "Opolex",               //8
                            "OposTestTic",          //9
                            "failed_questions"      //10
                            ];

        return arrayList;

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

        let array_commands = [  "/start",       //0
                                "/help",        //1
                                "/quiz",        //2
                                "/b1",          //3
                                "/b2",          //4
                                "/b3",          //5
                                "/b4",          //6
                                "/2014",        //7
                                "/2015",        //8
                                "/2016",        //9
                                "/2017",        //10
                                "/2018",        //11
                                "/stop",        //12
                                "/wiki",        //13
                                "/test",        //14
                                "/inap",        //15
                                "/emilio",      //16
                                "/adams",       //17
                                "/gokoan",      //18
                                "/oposapiens",  //19
                                "/searches",    //20
                                "/opositatest", //21
                                "/daypo",       //22
                                "/preparatic",  //23
                                "/opostestic",  //24
                                "/tema",        //25
                                "/blocXtema",   //26
                                "/opolex",      //27
                                "/failed",      //28
                                "/funcionaTest", //29
                                "/exam"         //30
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

    getTestKeyboardSiNo: function(){

        let keyboard_si_no = { "reply_markup": { "keyboard": [this.listSiNo()], "one_time_keyboard": true } };

        return keyboard_si_no;
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

    getTestKeyboardTemas: function(){

        let columnas = 3;
        let temas = this.listTemas();
        let temasXfila = [];
        let keyboard = [];
        let keyboard_temas = {};

        for(var i=0; i<=temas.length; i++){
            if (temas[i] !== undefined){
                temasXfila.push(temas[i]);
            }
            if( i > 0){
                if( (i+1) % columnas == 0){
                    keyboard.push(temasXfila);
                    temasXfila = [];
                }
            }
        }

        keyboard_temas  =   {
                            "reply_markup": { //"keyboard": [this.listYears()],
                                "keyboard": keyboard,
                                "one_time_keyboard": true
                            }}

        return keyboard_temas;
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

        keyboard_idioma = {"inline_keyboard": 
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
        
        //let keyboard_idioma = { "reply_markup": { "keyboard": [this.listIdiomas()], "one_time_keyboard": true } };

        return keyboard_idioma;
    }
}
