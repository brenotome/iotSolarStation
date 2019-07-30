load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_i2c.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_adc.js');
load('api_sys.js');

// Nossos modulos JS para os diferentes componentes----
load('gyro.js');
load('multiplex.js');
load('servo.js');

// Variaveis e constantes globais ---------------------
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
  D8 : 15,  // Boot fails if pulled HIGH. Hardware PWM
};
let MULTIPLEX_ADDRESS = {
  LDR1 : 0 ,
  LDR2 : 1 ,
};
let CURRENT_SERVO_MODE = "manual"; // 'auto' ou 'manual'
let SEND_MQTT_INTERVAL_MS = 1000; // tempo entre enviar mensagens mqtt com valores lidos na hora
let UPDATE_ANGLE_INTERVAL_MS = 1000; // tempo entre atualizacoes de angulo

// Configurando inicialmente alguns componentes fisicos ---
GYRO.setup(0); // 0 -> no sleep mode
SERVO.setup( NODEMCU_GPIO.D1 /*PINO DO SERVO*/ );
MULTIPLEX.setup( /* PIN_SEL_01 , PIN_SEL_02 , PIN_SEL_03 */ NODEMCU_GPIO.D1 , NODEMCU_GPIO.D1 , NODEMCU_GPIO.D1 );

// Rotina de funcionamento -----------------
let last_ldr1_read = null;
let last_ldr2_read = null;
Timer.set(UPDATE_ANGLE_INTERVAL_MS, Timer.REPEAT , function(){
  GYRO.update();
  // Simplesmente altera o servo de acordo com a diferenca dos valores lidos dos LDR
  last_ldr1_read = MULTIPLEX.read( MULTIPLEX_ADDRESS.LDR1 );
  last_ldr2_read = MULTIPLEX.read( MULTIPLEX_ADDRESS.LDR2 );
  
  if( last_ldr1_read > 1.1 * last_ldr2_read ){
    SERVO.goToDeg( SERVO.LAST_ANGLE + 5 );
  } else if( last_ldr2_read > 1.1 * last_ldr1_read ){
    SERVO.goToDeg( SERVO.LAST_ANGLE - 5 );
  }
}, null);

// Comunicacao MQTT, enviando e recebendo 
//  Mqtt ---- Enviando
let fake_angle = -10;
Timer.set(SEND_MQTT_INTERVAL_MS, Timer.REPEAT, function() {
  if(MQTT.isConnected()){
    print("Sending MQTTs")
    fake_angle++;
    MQTT.pub("power_pack/servo", JSON.stringify(fake_angle) , 0 , false );
    if( last_ldr1_read !== null ){
      MQTT.pub("power_pack/ldr1" , JSON.stringify(last_ldr1_read) , 0 , false );
    }
    if( last_ldr2_read !== null ){
      MQTT.pub("power_pack/ldr1" , JSON.stringify(last_ldr2_read) , 0 , false );
    }
    if( GYRO.Accel.x !== null ){
      MQTT.pub("power_pack/gyro_accel" , JSON.stringify( GYRO.Accel ) , 0 , false );
    }
    MQTT.pub("power_pack/servo_mode" , CURRENT_SERVO_MODE , 1 , false );
  }
}, null);
 
//  Mqtt ---- Recebendo
let topics_to_subscribe = [
  "power_pack/set_servo_mode",
  "power_pack/set_servo_angle",
];
function MQTT_receive( connection , topic , message ){
  print("MQTT received.\ntopic: " , topic , "; message: " , message );
  if( topic === 'power_pack/set_servo_mode' ){
    CURRENT_SERVO_MODE = message.slice(0);
  } else if( topic === 'power_pack/set_servo_angle' ){
    if( CURRENT_SERVO_MODE === 'manual' ){
      SERVO.goToDeg( JSON.parse(message) );
    } else {
      print("received 'set_servo_angle' for " , message , " but my CURRENT_SERVO_MODE is: " , CURRENT_SERVO_MODE );
    }
  }
};
MQTT.setEventHandler( function( con , ev , evdata ){
  if( ev === MQTT.EV_CONNACK ){
    for( let i in topics_to_subscribe ){
      MQTT.sub( topics_to_subscribe[i] , MQTT_receive );
    }
  } else if ( ev === MQTT.EV_CLOSED ){
    print( "Conexao com o broker finalizada" );
  }

}, null);