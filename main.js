const request = new XMLHttpRequest();

request.open("GET", "postprocessed_data.json", true);

request.onload = function () {
    const data = JSON.parse(this.response);
    const latestStatus = Object.keys(data);
    console.log(latestStatus);
    console.log(Math.min(latestStatus))
}

request.send();