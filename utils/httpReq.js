

const fetchData = async (url) => {
try {
    const res = await fetch(url);
    const json = await res.json();
    if (+json.cod == 200) {
        return json;
    } else if (+json.cod === 404) {
        alert("city not found");
    }
} catch (error) {
    console.log("error")
}
}

export default fetchData;