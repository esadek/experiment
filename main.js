const dataPlaneUrl = document.getElementById("data-plane-url");
const allSystems = document.getElementById("all-systems");
const server = document.getElementById("server");
const db = document.getElementById("database");
const acceptingEvents = document.getElementById("accepting-events");
const routingEvents = document.getElementById("routing-events");

const checkCircle = "<i class=\"bi bi-check-circle-fill\"></i>";
const xCircle = "<i class=\"bi bi-x-circle-fill\"></i>";

const request = new XMLHttpRequest();
request.open("GET", "postprocessed_data.json", true);
request.onload = function () {
    const data = JSON.parse(this.response);
    const statusTimes = Object.keys(data);
    const latestStatus = data[statusTimes[statusTimes.length - 1]];
    const days = {};

    statusTimes.forEach(statusTime => {
        const day = statusTime.slice(0, 10);
        if (!days[day]) {
            days[day] = {
                server: { up: 0, down: 0 },
                db: { up: 0, down: 0 },
                acceptingEvents: { up: 0, down: 0 },
                routingEvents: { up: 0, down: 0 }
            };
        }
        const status = data[statusTime];
        status.server === "UP" ? days[day].server.up += 1 : days[day].server.down +=1;
        status.db === "UP" ? days[day].db.up += 1 : days[day].db.down +=1;
        status.acceptingEvents === "TRUE" ? days[day].acceptingEvents.up += 1 : days[day].acceptingEvents.down +=1;
        status.routingEvents === "TRUE" ? days[day].routingEvents.up += 1 : days[day].routingEvents.down +=1;
    });

    Object.keys(days).forEach(day => {
        ["server", "db", "acceptingEvents", "routingEvents"].forEach(type => {
            const up = days[day][type].up;
            const down = days[day][type].down;
            days[day][type] = ((up + down > 0) ? up / (up + down) : up) * 100;
        })
        let backgroundColorClass = "";
        ["server", "db", "acceptingEvents", "routingEvents"].forEach(type => {
            const uptime = days[day][type];
            backgroundColorClass = "bg-success";
            if (uptime < 100 && uptime > 90) {
                backgroundColorClass = "bg-warning";
            } else if (uptime <= 90) {
                backgroundColorClass = "bg-danger";
            }
            eval(type).innerHTML += `<div class="${backgroundColorClass}" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-trigger="hover focus" title="${day}" data-bs-content="${uptime.toFixed(2)}% uptime"></div>`;
        })
    });

    if (
        latestStatus.server === "UP" &&
        latestStatus.db === "UP" &&
        latestStatus.acceptingEvents === "TRUE" &&
        latestStatus.routingEvents === "TRUE"
    ) {
        allSystems.style = "color: white; background-color: #198754; border-color: #125F3B;";
        allSystems.innerHTML = checkCircle + "&ensp;All Systems Operational";
    } else {
        allSystems.style = "color: white; background-color: #DC3545; border-color: #A71E2B;";
        allSystems.innerHTML = xCircle + "&ensp;System Down";
    }

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}
request.send();

const request2 = new XMLHttpRequest();
request2.open("GET", ".github/workflows/flat.yml", true);
request2.onload = function () {
    dataPlaneUrl.innerHTML = this.response.split("\n")[22].split(": ")[1];
    
}
request2.send();
