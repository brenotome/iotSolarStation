load("api_pwm.js");
let SERVO = {
    PIN: null,
    LAST_ANGLE: 0,
    
    setup : function( _pin ){
        GPIO.set_mode( _pin , GPIO.MODE_OUTPUT );
        this.PIN = _pin;
    },

    goToDeg : function( degree ){
        if( this.PIN !== null ){
            print("SERVO going to : " , degree );
            let duty_cycle = 0.025 + 0.10*degree/180.0;
            PWM.set( this.PIN , 50 , duty_cycle );
            this.LAST_ANGLE = degree;
            // Is the following procedure useful to save energy?
            // Sys.usleep(100000) // 1s sleep.
            // PWM.set(this.PIN,0,duty_cycle); // Disabling PWM now
        }
    }

};
