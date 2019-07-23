load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_sys.js');


Timer.set(2000, Timer.REPEAT, function() {
  // state.uptime = Sys.uptime();
  // state.ram_free = Sys.free_ram();
  // print('online:', online, JSON.stringify(state));
  if(MQTT.isConnected()){
    print('on');
  }else{print('off')}
  // print(JSON.stringify(state))
  MQTT.pub('echo','teste123',null);
}, null);

MQTT.sub('echo/#',function(conn, topic, msg){
  print('msg:',msg);
},null);

function duty(angle){
  let angle= (((JSON.parse(msg)*(0.111111-0.024691))/180)+0.024691);
  //min 0.024691
  //max 0.111111
  return angle;
}

MQTT.sub('servo/#',function(conn, topic, msg){
  PWM.set(02,50,duty(msg));
  Sys.usleep(700000); 
  print('bruto:',duty(msg));
  print('angulo:',msg);
  PWM.set(02,0,0);
},null);