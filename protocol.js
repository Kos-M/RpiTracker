const Protocol = {
    Connected: "100",
    Connecting: "101",
    DisConnect: "102",
    DO_REBOOT: "-1",
    DO_SHUTDOWN: "0",
    GET_UP_TIME: "200",
    GET_HOST_NAME: "201",
    GET_OS: "202",
    GET_HDD: "203",
    ANS_UPTIME: "300",
    ANS_HOST_NAME: "301",
    ANS_OS: "302",
    ANS_HDD: "303",
    ERROR: {
        INVALID_ID: "-10"
    }
}
module.exports = Protocol;