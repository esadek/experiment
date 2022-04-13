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

const checkCircle = "<i class=\"bi bi-check-circle-fill\"></i>";
const xCircle = "<i class=\"bi bi-x-circle-fill\"></i";

const upHtml = "UP " + checkCircle;
const downHtml = "DOWN " + xCircle;
const trueHtml = "TRUE " + checkCircle;
const falseHtml = "FALSE " + xCircle;

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
        allSystems.innerHTML = checkCircle + "&ensp;All Systems Operational";
    } else {
        allSystems.style = "color: white; background-color: #DC3545; border-color: #A71E2B;";
        allSystems.innerHTML = xCircle + "&ensp;System Down";
    }

    if (latestStatus.server === "UP") {
        server.className = "text-success";
        server.innerHTML = upHtml;
    } else {
        server.className = "text-danger";
        server.innerHTML = downHtml;
    }

    if (latestStatus.db === "UP") {
        database.className = "text-success";
        database.innerHTML = upHtml;
    } else {
        database.className = "text-danger";
        database.innerHTML = downHtml;
    }

    if (latestStatus.acceptingEvents === 'TRUE') {
        acceptingEvents.className = "text-success";
        acceptingEvents.innerHTML = trueHtml;
    } else {
        acceptingEvents.className = "text-danger";
        acceptingEvents.innerHTML = falseHtml;
    }

    if (latestStatus.routingEvents === 'TRUE') {
        routingEvents.className = "text-success";
        routingEvents.innerHTML = trueHtml;
    } else {
        routingEvents.className = "text-danger";
        routingEvents.innerHTML = trueHtml;
    }

    appType.innerHTML = latestStatus.appType;
    mode.innerHTML = latestStatus.mode;
    goroutines.innerHTML = latestStatus.goroutines;
    backendConfigMode.innerHTML = latestStatus.backendConfigMode;
    lastSync.innerHTML = latestStatus.lastSync;
}

request.send();