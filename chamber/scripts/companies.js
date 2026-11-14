async function getData(){
    const response = await fetch(companies); // request data
    const data = await response.json(); // parse the JSON data
    console.console.log(data);  // output data response
}

getData();