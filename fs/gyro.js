let GYRO = {

    MPU6050_ADDRESS :           0x68 ,
    MPU6050_REG_POWER_MGMT_1 :  0x6B ,
    MPU6050_REG_ACCEL_X :       0x3B ,
    
    Accel : {
        x : null ,
        y : null ,
        z : null 
    },

    Temp : null ,

    Gyro : {
        x : null ,
        y : null ,
        z : null 
    },

    setup : function( pwr_mg ){
        let i2c = I2C.get();
        I2C.writeRegB( i2c , this.MPU6050_ADDRESS , this.MPU6050_REG_POWER_MGMT_1 , pwr_mg );
    },

    update : function() {
        let i2c = I2C.get();
        this.Accel.x = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X );
        this.Accel.y = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X + 2);
        this.Accel.z = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X + 4);
        this.Temp    = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X + 6);
        this.Gyro.x  = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X + 8);
        this.Gyro.y  = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X + 10);
        this.Gyro.z  = I2C.readRegW( i2c , this.MPU6050_ADDRESS, this.MPU6050_REG_ACCEL_X + 12);
        // Unsigned values -> signed vaues
        if( this.Accel.x >= 32768 ) this.Accel.x -= 65536;
        if( this.Accel.y >= 32768 ) this.Accel.y -= 65536;
        if( this.Accel.z >= 32768 ) this.Accel.z -= 65536;
        if( this.Temp >= 32768 ) this.Temp -= 65536;
        if( this.Gyro.x >= 32768 ) this.Gyro.x -= 65536;
        if( this.Gyro.y >= 32768 ) this.Gyro.y -= 65536;
        if( this.Gyro.z >= 32768 ) this.Gyro.z -= 65536;
    }
    
};
