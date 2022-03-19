const request = new XMLHttpRequest();

request.open("GET", "postprocessed_data.json", true);

request.onload = function () {
    const data = JSON.parse(this.response);
    console.log(data);
}

request.send();