load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_adc.js');
load('api_timer.js');
load('api_sys.js');
load('api_pwm.js');
load('api_mqtt.js');

load('gyro.js');
load('multiplex.js');
load('servo.js');

let NODEMCU_GPIO = {
  
  // General use digital pins:
  D0 : 16,  // HIGH at boot. Used to wake-up from deep sleep
  D1 : 5 ,
  D2 : 4 ,  // Hardware PWM
  D3 : 0 ,  // Boot fails if pulled LOW
  D4 : 2 ,  // HIGH at boot. Boot fails if pulled LOW. Builtin LED
  D5 : 14,  // Hardware PWM
  D6 : 12,  // Hardware PWM
  D7 : 13,
  D8 : 15 , // Boot fails if pulled HIGH. Hardware PWM
  
  // I2C recommended pins
  SCL : 5,
  SDA : 4 ,
};

let MULTIPLEX_ADDRES = {
  LDR_1 : 0 ,
  LDR_2 : 1 ,
  CURRENT_SENSOR : 2 ,
};

// Exemplo simples de um blink a cada 1s com Led
let LED_PIN = NODEMCU_GPIO.D2;
let led_value = 0;
GPIO.set_mode( LED_PIN , GPIO.MODE_OUTPUT );
Timer.set( 1000 , true , function(){
  led_value = (led_value+1)%2;
  GPIO.write( LED_PIN , led_value );
  if( led_value ){
    print("Blink");
  }
  else{
    print("Blonk");
  }
},null);


// Usando o servo:
SERVO.setup( NODEMCU_GPIO.D3 );
SERVO.goToDeg( 140 );

// Testando o ADC
ADC.enable(0);
Timer.set( 1000 , Timer.REPEAT , function(){
  print("Valor do ADC(0): " , ADC.read(0) )
},null) 


