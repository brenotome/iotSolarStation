load("api_pwm.js");
let SERVO = {
    PIN: null,
    
    setup : function( _pin ){
        GPIO.set_mode( _pin , GPIO.MODE_OUTPUT );
        this.PIN = _pin;
    },

    goToDeg : function( degree ){
        let duty_cycle = 0.025 + 0.10*degree/180.0;
        PWM.set( this.PIN , 50 , duty_cycle );
    }

};
