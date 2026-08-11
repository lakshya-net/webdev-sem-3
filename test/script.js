function add(a, b) {
    return a + b;
}
console.log(add(5, 10));
 



const subtract = (a, b) => {
    return a - b;
}
console.log(subtract(10, 5));

async function fetchData() {
    console.log("Fetching data...");
    const response = await fetch("./students.json");
    console.log("Response received:", response);
    const data = await response.json();
    console.log("Data fetched:", data);
}

fetchData();