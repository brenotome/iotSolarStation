load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_sys.js');

ADC.enable(0);

let pinServo = 02;
let s1 = 16;
let s2 = 5;
let s3 = 4;
let s4 = 0;
let ldr1 = 5; //d5
let ldr2 = 6; //d6

GPIO.set_mode(s1, GPIO.MODE_OUTPUT);
GPIO.set_mode(s2, GPIO.MODE_OUTPUT);
GPIO.set_mode(s3, GPIO.MODE_OUTPUT);
GPIO.set_mode(s4, GPIO.MODE_OUTPUT);


Timer.set(500, Timer.REPEAT, function() {
  // state.uptime = Sys.uptime();
  // state.ram_free = Sys.free_ram();
  // print('online:', online, JSON.stringify(state));
  if(MQTT.isConnected()){
    print('on'); // console mos
  }
  // print(JSON.stringify(state))
  MQTT.pub('alive','on',null); // para saber se o painel está atualizando
  MQTT.pub('ldr1_read', muxRead(ldr1),null);
  MQTT.pub('ldr2_read', muxRead(ldr2),null);
  // MQTT.pub('ldr1_read', muxRead(ldr2),null); // mesmo esquema para todos sensores

}, null);

// MQTT.sub('echo/#',function(conn, topic, msg){
//   print('msg:',msg);
// },null);

function muxSet(v1,v2,v3,v4){
  GPIO.write(s1, v1);
  GPIO.write(s2, v2);
  GPIO.write(s3, v3);
  GPIO.write(s4, v4);
}

function muxRead(value){
  muxSet(value & 1, (value & 2)/2 , (value & 4)/4 ,(value & 8)/8);
  Sys.usleep(200000); //200ms
  return ADC.read(0);
}

function duty(angle){
  let angle= (((JSON.parse(msg)*(0.111111-0.024691))/180)+0.024691);
  //min 0.024691
  //max 0.111111
  return angle;
}

function servoTo(angle){
  PWM.set(pinServo,50,duty(angle)); // sinal para ir no angulo
  Sys.usleep(700000); //tempo para o servo chegar lá
  print('bruto:',duty(angle));
  print('angulo:',angle);
  PWM.set(02,0,0);//reseta o sinal de pwm para zero
  MQTT.pub('servo_read', angle ,null);//assim que o angulo muda ele envia para o mqtt
}




// MQTT.sub('servo/#',function(conn, topic, msg){
//   PWM.set(02,50,duty(msg));
//   Sys.usleep(700000); 
//   print('bruto:',duty(msg));
//   print('angulo:',msg);
//   PWM.set(02,0,0);
// },null);
