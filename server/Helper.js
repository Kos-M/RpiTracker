class Helper {

    static async  Logger(msg) {
        let now = new Date();
        if (typeof msg == "object") {
            console.dir(JSON.stringify(msg))
        } else {
            console.log('[ ' + now.toLocaleTimeString() + " ] " + msg)
        }
    }
    /**
     * Removes element from an array
     *  @params {String id , Array array} 
     *  @returns {Array array}
     */
    static deleteByiD(id, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                array.splice(i, 1); // remove element with index of matched id
            }
        }
        return array;
    }

}

module.exports = exports = Helper;