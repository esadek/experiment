const allSystems = document.getElementById('all-systems');
const server = document.getElementById('server');
const database = document.getElementById('database');
const acceptingEvents = document.getElementById('accepting-events');
const routingEvents = document.getElementById('routing-events');
const appType = document.getElementById('app-type');
const mode = document.getElementById('mode');
const goroutines = document.getElementById('goroutines');
const backendConfigMode = document.getElementById('backend-config-mode');
const lastSync = document.getElementById('last-sync');

const request = new XMLHttpRequest();

request.open("GET", "postprocessed_data.json", true);

request.onload = function () {
    const data = JSON.parse(this.response);
    const statusTimes = Object.keys(data);
    const latestStatus = data[statusTimes[statusTimes.length - 1]];

    const days = {};
    statusTimes.forEach(statusTime => {
        const day = statusTime.slice(0, 10);
        if (!days[day]) days[day] = "UP";
        const status = data[statusTime];
        if (
            status.server !== "UP" ||
            status.db !== "UP" ||
            status.acceptingEvents !== "TRUE" ||
            status.routingEvents !== "TRUE"
        ) {
            days[day] = "DOWN";
        }
    });
    console.log(days);

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

    if (latestStatus.server === 'UP') {
        server.className = 'text-success';
        server.innerHTML = 'UP <i class=\"bi bi-check-circle-fill\"></i>';
    } else {
        server.className = 'text-danger';
        server.innerHTML = 'DOWN <i class=\"bi bi-x-circle-fill\"></i>';
    }

    if (latestStatus.db === 'UP') {
        database.className = 'text-success';
        database.innerHTML = 'UP <i class=\"bi bi-check-circle-fill\"></i>';
    } else {
        database.className = 'text-danger';
        database.innerHTML = 'DOWN <i class=\"bi bi-x-circle-fill\"></i>';
    }

    if (latestStatus.acceptingEvents === 'TRUE') {
        acceptingEvents.className = 'text-success';
        acceptingEvents.innerHTML = 'TRUE <i class=\"bi bi-check-circle-fill\"></i>';
    } else {
        acceptingEvents.className = 'text-danger';
        acceptingEvents.innerHTML = 'FALSE <i class=\"bi bi-x-circle-fill\"></i>';
    }

    if (latestStatus.routingEvents === 'TRUE') {
        routingEvents.className = 'text-success';
        routingEvents.innerHTML = 'TRUE <i class=\"bi bi-check-circle-fill\"></i>';
    } else {
        routingEvents.className = 'text-danger';
        routingEvents.innerHTML = 'FALSE <i class=\"bi bi-x-circle-fill\"></i>';
    }

    appType.innerHTML = latestStatus.appType;
    mode.innerHTML = latestStatus.mode;
    goroutines.innerHTML = latestStatus.goroutines;
    backendConfigMode.innerHTML = latestStatus.backendConfigMode;
    lastSync.innerHTML = latestStatus.lastSync;
}

request.send();