module.exports = {

    empezar: function(marcha){

        if (marcha==0) { //solo si el cronómetro esta parado
            marcha=1 //indicamos que se ha puesto en marcha.
        }

        return marcha;
    },

    tiempo: function(marcha, actual, empiece, time){
        
        actual=new Date() //fecha en el instante
        console.log("actual ", actual);
        console.log("empiece ", empiece);
        time=actual-empiece //tiempo transcurrido en milisegundos
        console.log("time ", time);
        let temp=new Date() //fecha donde guardamos el tiempo transcurrido
        temp.setTime(time) 
        console.log("temp ", temp);
        let sg=temp.getSeconds(); //segundos del cronómetro
        let mn=temp.getMinutes(); //minutos del cronómetro
        let ho=temp.getHours()-1; //horas del cronómetro
        let tiempo = "";
        if(ho===0 | ho===-1)
            tiempo=mn+":"+sg; /*+":"+ms;*/ //pasar a pantalla.
        else
            tiempo = ho+":"+mn+":"+sg; /*+":"+ms;*/ //pasar a pantalla.
        marcha, time = this.reiniciar(marcha, time);

        return tiempo;

    },
    reiniciar: function(marcha, time){

        if (marcha==1) { //sólo si está en funcionamiento
            marcha=0; //indicar que está parado.	
        }
        time=0; //tiempo transcurrido a cero

        return marcha, time;
    }

}