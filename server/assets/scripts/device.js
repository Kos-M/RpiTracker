
function createTable(data) {
    console.log("createTable")

    var responsive = document.createElement('div');
    var table = document.createElement('table');
    var head = document.createElement('thead');
    var trhead = document.createElement('tr');
    var th1 = document.createElement('th')
    var th2 = th1.cloneNode(true)
    var th3 = th1.cloneNode(true)
    var th4 = th1.cloneNode(true)
    var th5 = th1.cloneNode(true)
    var th6 = th1.cloneNode(true)
    var th7 = th1.cloneNode(true)
    th1.innerText = "#";
    th2.innerText = "Hostname";
    th3.innerText = "Os";
    th4.innerText = "Ip";
    th5.innerText = "Connected";
    th6.innerText = "Uptime";
    th7.innerText = "Id";
    var tbo = document.createElement('tbody');
    //var body_tr =  document.createElement('tr');

    responsive.className = "table-responsive"
    table.className = "table table-striped"
    tbo.id = "the_body"

    responsive.appendChild(table)
    table.appendChild(head)
    head.appendChild(trhead)
    trhead.appendChild(th1)
    trhead.appendChild(th2)
    trhead.appendChild(th3)
    trhead.appendChild(th4)
    trhead.appendChild(th5)
    trhead.appendChild(th6)
    trhead.appendChild(th7)
    table.appendChild(tbo)
    document.getElementById('respon_sive_container').append(responsive)
    fillData(data)
}
function fillData(data) {
    console.log("fillData")
    $("#the_body").html("")
    $("table tbody").html("")
    for (let i = 0; i < data.length; i++) {
        var fragment = document.createDocumentFragment()
        var tr = document.createElement('tr');

        var Numb = document.createElement('td');
        var hostname = document.createElement('td');
        var os = document.createElement('td');
        var ip = document.createElement('td');
        var connected = document.createElement('td');
        var uptime = document.createElement('td');
        uptime.style = "color:#919119"
        var id = document.createElement('td');
        id.style = "color:#2d4823"

        Numb.innerText = i + 1;
        hostname.innerText = data[i].hostname
        os.innerText = data[i].os;
        ip.innerText = data[i].ip;
        connected.innerText = moment(data[i].connected).fromNow()
        uptime.innerText = moment(data[i].uptime).fromNow()
        id.innerText = data[i].id;

        tr.appendChild(Numb)
        tr.appendChild(hostname)
        tr.appendChild(os)
        tr.appendChild(ip)
        tr.appendChild(connected)
        tr.appendChild(uptime)
        tr.appendChild(id)
        fragment.appendChild(tr)
        document.getElementById('the_body').appendChild(fragment);
    }

}

function update() {
    $.get("/results", function (data) {

        $("#dev_value").text(" " + data.active)
        if (data.clients.length == 0) {
            $("#respon_sive_container").html("") //emptu table div
            $("#devices").css("display", "none")
            $("#notFound").css("display", "block")
            $("#page-header").css("display", "block")
        } else {
            $("#notFound").css("display", "none")
            $("#devices").css("display", "block")
            $("#page-header").css("display", "block")
            if (!document.getElementById('the_body')) {
                createTable(data.clients)
                return;
            }
            fillData(data.clients)
        }    
    })
}
update()
setTimeout(setInterval(update, 5000), 2000)
