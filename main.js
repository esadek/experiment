const request = new XMLHttpRequest();

request.open('GET', '2022_14_18_02_14_50data.json', true);

request.onload = function () {
    const data = JSON.parse(this.response);
    console.log(data);
}

request.send();