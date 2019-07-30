let MULTIPLEX = {
    
    PIN_SEL_1 : null,
    PIN_SEL_2 : null,
    PIN_SEL_3 : null,

    setup : function( _pin_sel_1 ,_pin_sel_2 ,_pin_sel_3 ){
        this.PIN_SEL_1 = _pin_sel_1;
        this.PIN_SEL_2 = _pin_sel_2;
        this.PIN_SEL_3 = _pin_sel_3;
        GPIO.set_mode( this.PIN_SEL_1 , GPIO.MODE_OUTPUT );
        GPIO.set_mode( this.PIN_SEL_2 , GPIO.MODE_OUTPUT );
        if( this.PIN_SEL_3 !== null ){
            GPIO.set_mode( this.PIN_SEL_3 , GPIO.MODE_OUTPUT );
        }
        this.select(0);
    },

    select : function( addr ){
        GPIO.write( this.PIN_SEL_1 , (addr)%2 );
        GPIO.write( this.PIN_SEL_2 , (addr/2)%2 );
        if( this.PIN_SEL_3 !== null ){
            GPIO.write( this.PIN_SEL_3 , (addr/4)%2 );
        }
    },

    read : function( addr ){
        this.select( addr );
        return ADC.read(0);
    }

};
