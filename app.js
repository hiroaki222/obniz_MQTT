const Obniz = require("obniz");
const mqtt = require('mqtt');

const obniz = new Obniz("2777-2017");

//絶対値を取る関数
function abs(value) {
    return (value ** 2) ** (1 / 2)
}

//前回のコール時の温度と現在の温度を比較する関数
function process(speed, tmp) {
    //変化が10以上あれば転送する
    if (abs(tmp - speed) >= 10) {
        Publish(speed)
        tmp = speed
    }
    return tmp
}

//MQTTで転送する関数
function Publish(speed) {
    const client = mqtt.connect('mqtt://192.168.147.190', 1883);

    client.on('connect', () => {
        client.publish('ev3', String(speed));
        client.end();
    });
    return
}

//スピードを求める関数
function speed_calc(speed) {
    //初項 25 公差 3の等差数列のn番目を求める
    speed = Math.floor((speed - 22.0) / 3)
    //初項 50 公差 10の等差数列のn番目の項を求める
    speed = 10 * speed + 40
    //スピードが100より大きい時
    if (speed > 100) {
        speed = 100
    } else if (speed < 50) {
        speed = 0
    }
    return speed
}

obniz.onconnect = async function () {
    obniz.display.clear();
    obniz.display.print("Obniz is connected");
    console.log("Connected with obniz");

    let tmp = 0
    var tempsens = obniz.wired("Keyestudio_TemperatureSensor", { signal: 0, vcc: 1, gnd: 2 });
    tempsens.onchange = function (temp) {
        console.log(temp)
        tmp = process(speed_calc(temp), tmp)
        //現在の温度をディスプレに表示
        obniz.display.clear();
        obniz.display.print(temp);
    };
}   