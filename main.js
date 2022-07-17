// Get elements
const dataPlaneUrl = document.getElementById("data-plane-url");

const allSystems = document.getElementById("all-systems");

const server = document.getElementById("server");
const db = document.getElementById("database");
const acceptingEvents = document.getElementById("accepting-events");
const routingEvents = document.getElementById("routing-events");

const serverStatus = document.getElementById("server-status");
const dbStatus = document.getElementById("db-status");
const acceptingStatus = document.getElementById("accepting-status");
const routingStatus = document.getElementById("routing-status");

const serverUptime = document.getElementById("server-uptime");
const dbUptime = document.getElementById("db-uptime");
const acceptingEventsUptime = document.getElementById("accepting-uptime");
const routingEventsUptime = document.getElementById("routing-uptime");

// Set data plane URL
const request2 = new XMLHttpRequest();
request2.onload = function () {
    dataPlaneUrl.innerHTML = this.response.split("\n")[22].split(": ")[1];
}
request2.open("GET", ".github/workflows/flat.yml");
request2.send();


// Populate page using status data
const request = new XMLHttpRequest();
request.onload = function () {
    const data = JSON.parse(this.response);
    const statusTimes = Object.keys(data);
    const latestStatus = data[statusTimes[statusTimes.length - 1]];
    const systemNames = ["server", "db", "acceptingEvents", "routingEvents"];

    // All systems
    if (
        latestStatus.server === "UP" &&
        latestStatus.db === "UP" &&
        latestStatus.acceptingEvents === "TRUE" &&
        latestStatus.routingEvents === "TRUE"
    ) {
        allSystems.style = "color: white; background-color: #198754; border-color: #125F3B;";
        allSystems.innerHTML = "<i class=\"bi bi-check-circle-fill\"></i>&ensp;All Systems Operational";
    } else {
        allSystems.style = "color: white; background-color: #DC3545; border-color: #A71E2B;";
        allSystems.innerHTML = "<i class=\"bi bi-x-circle-fill\"></i>&ensp;System Down";
    }

    // Get daily and overall uptimes
    const overallUptime = {};
    systemNames.forEach(system => {
        overallUptime[system] = { up: 0, down: 0 };
    });
    const days = {};
    statusTimes.forEach(statusTime => {
        const status = data[statusTime];
        const day = statusTime.slice(0, 10);
        if (!days[day]) {
            days[day] = {
                server: { up: 0, down: 0 },
                db: { up: 0, down: 0 },
                acceptingEvents: { up: 0, down: 0 },
                routingEvents: { up: 0, down: 0 }
            };
        }
        systemNames.forEach(system => {
            if (status[system] === "UP" || status[system] === "TRUE") {
                days[day][system].up += 1;
                overallUptime[system].up += 1;
            } else {
                days[day][system].down +=1;
                overallUptime[system].down += 1;
            }
        })
    });

    // Set overall uptimes
    systemNames.forEach(system => {
        const up = overallUptime[system].up;
        const down = overallUptime[system].down;
        const uptime = Math.floor(((up + down > 0) ? up / (up + down) : up) * 100);
        eval(system + "Uptime").innerHTML = uptime + "% Uptime";
        eval(system + "Uptime").className = uptime > 90 ? "text-success" : "text-danger";

    });

    Object.keys(days).forEach(day => {
        systemNames.forEach(system => {
            const up = days[day][system].up;
            const down = days[day][system].down;
            days[day][system] = Math.floor(((up + down > 0) ? up / (up + down) : up) * 100);
        })
        let backgroundColorClass = "";
        systemNames.forEach(system => {
            const uptime = days[day][system];
            backgroundColorClass = "bg-success";
            if (uptime < 100 && uptime > 90) {
                backgroundColorClass = "bg-warning";
            } else if (uptime <= 90) {
                backgroundColorClass = "bg-danger";
            }
            eval(system).innerHTML += `<div class="${backgroundColorClass}" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-trigger="hover focus" title="${day}" data-bs-content="${uptime}% uptime"></div>`;
        })
    });

    // Latest status
    const systems = {
        server: serverStatus,
        db: dbStatus,
        acceptingEvents: acceptingStatus,
        routingEvents: routingStatus
    };
    Object.keys(systems).forEach(status => {
        if (latestStatus[status] === "UP" || latestStatus[status] === "TRUE") {
            eval(systems[status]).className = "bi bi-check-circle-fill text-success";
            eval(systems[status]).setAttribute("data-bs-content", "Operational");
        } else {
            eval(systems[status]).className = "bi bi-x-circle-fill text-danger";
            eval(systems[status]).setAttribute("data-bs-content", "Down");
        }
    })

    // Popper
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}
request.open("GET", "postprocessed_data.json");
request.send();
