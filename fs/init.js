load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_sys.js');

// Nossos modulos ----
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



Timer.set(1000, Timer.REPEAT, function() {
  if(MQTT.isConnected()){
    print('MQTT is connected');
  } else {
    print("MQTT isn't connected");
  }
}, null);