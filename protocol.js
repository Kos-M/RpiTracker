const Protocol = {
    Connected: "100",
    Connecting: "101",
    DisConnect: "102",    
    DO_REBOOT: "reboot_now",
    DO_SHUTDOWN: "shut_down_now" ,
    GET_UP_TIME: "up_time",
    GET_HOST_NAME: "get_hostname",
    GET_OS: "get_os" ,
    GET_HDD: "get_hdd",
    ANS_UPTIME: "up_time",
    ANS_HOST_NAME: "host" ,
    ANS_OS: "os",
    ANS_HDD :"hdd_specs",
    ERROR :{
        INVALID_ID:"-10"
    }
}
module.exports = Protocol;