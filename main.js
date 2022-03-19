const statusElement = document.getElementById("status");

const request = new XMLHttpRequest();

request.open("GET", "postprocessed_data.json", true);

request.onload = function () {
    const data = JSON.parse(this.response);
    const statusTimes = Object.keys(data);
    const latestStatus = data[statusTimes[statusTimes.length - 1]];
    if (
        latestStatus.server === "UP" &&
        latestStatus.db === "UP" &&
        latestStatus.acceptingEvents === "TRUE" &&
        latestStatus.routingEvents === "TRUE"
    ) {
        statusElement.innerHTML = "All Systems Operational";
    }
}

request.send();