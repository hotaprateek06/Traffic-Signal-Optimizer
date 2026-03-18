fetch("http://localhost:5000/optimize", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        A: 25,
        B: 10,
        C: 40,
        D: 15
    })
})
.then(res => res.text())   // IMPORTANT
.then(data => console.log(data))
.catch(err => console.error(err));