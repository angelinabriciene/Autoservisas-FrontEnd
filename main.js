document.getElementById('submitNewVehicle').addEventListener('click', () => {
    console.log("Paspaustas submit");
    createVehicle(document.getElementById('vehicleForm'));
});

document.getElementById('getVehicle').addEventListener('click', () => {
    getVehicle(document.getElementById('OneVehicleForm'));
});

function showAlert(message) {
    alert(message);
}

getVehicles();

function createVehicleList(container, data) {
    const tableBody = document.getElementById("listOfVehicles").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    data.forEach(vehicle => {
        const row = tableBody.insertRow();
        const manufacturerCell = row.insertCell();
        const modelCell = row.insertCell();
        const releaseYearCell = row.insertCell();

        manufacturerCell.innerHTML = vehicle.manufacturer;
        modelCell.innerHTML = vehicle.model;
        releaseYearCell.innerHTML = vehicle.releaseYear;
    });
}

function getVehicles() {
    fetch("http://127.0.0.1:8000/getVehicles")
        .then(response => response.json())
        .then(data => {
            createVehicleList(document.getElementById("listOfVehicles"), data);
        });
}

function getVehicle(form) {
    if (!(form instanceof HTMLFormElement)) {
        console.error("Invalid form element:", form);
        return;
    }
    let formData = {};
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });
    const vehicleId = formData.vehicleIdInput;
    fetch(`http://127.0.0.1:8000/getVehicle?id=${vehicleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const cardBody = document.getElementById("vehicleCard").getElementsByClassName("card-body")[0];
            cardBody.innerHTML = "";

            const vehicleHTML = `
                <h1 class="card-title">${data.manufacturer} ${data.model} ${data.releaseYear}</h1>`;
            cardBody.innerHTML = vehicleHTML;
        })
        .catch(error => {
            console.error("Error getting vehicle:", error);
            showAlert("Klaida: negalima gauti įrašo");
        });
}

function createVehicle(form) {
    if (!(form instanceof HTMLFormElement)) {
        console.error("Invalid form element:", form);
        return;
    }

    let formData = {};
    const inputs = form.querySelectorAll('input');

    console.log(inputs);

    inputs.forEach(input => {
        formData[input.id] = input.value;
        console.log("inputas", formData);
    });

    fetch(`http://127.0.0.1:8000/createVehicle`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                showAlert("Įrašas sukurtas");
                form.reset();
            } else {
                showAlert("Klaida: negalima sukurti įrašo");
            }
        })
        .catch(error => {
            console.error("Error creating vehicle:", error);
            showAlert("Klaida: negalima sukurti įrašo");
        });
}