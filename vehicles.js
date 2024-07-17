document.getElementById('submitNewVehicle').addEventListener('click', () => {
    createVehicle(document.getElementById('vehicleForm'));
});

function showAlert(message) {
    alert(message);
}

getVehicles();
getFuelTypesForVehicleCreate();

function createVehicleList(container, data) {
    const tableBody = document.getElementById("listOfVehicles").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    data.forEach(vehicle => {
        const row = tableBody.insertRow();
        const manufacturerCell = row.insertCell();
        const modelCell = row.insertCell();
        const releaseYearCell = row.insertCell();
        const fuelCell = row.insertCell();
        const actionCell = row.insertCell();

        manufacturerCell.innerHTML = vehicle.manufacturer;
        modelCell.innerHTML = vehicle.model;
        releaseYearCell.innerHTML = vehicle.releaseYear;
        fuelCell.innerHTML = vehicle.fuelType.fuelType;

        const detailButton = document.createElement("button");
        detailButton.type = "button";
        detailButton.className = "btn btn-secondary";
        detailButton.innerHTML = "More";
        detailButton.onclick = function () {
            getVehicle(vehicle.id);
        };

        const updateButton = document.createElement("button");
        updateButton.type = "button";
        updateButton.className = "btn btn-primary";
        updateButton.innerHTML = "Update";
        updateButton.onclick = function () {
            updateVehicle(vehicle.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-danger";
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function () {
            deleteVehicle(vehicle.id);
        };
        actionCell.appendChild(detailButton);
        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
    });
}

function getVehicles() {
    fetch("http://127.0.0.1:8000/getVehicles")
        .then(response => response.json())
        .then(data => {
            createVehicleList(document.getElementById("listOfVehicles"), data);
        });
}

function getVehicle(vehicleId) {
    fetch(`http://127.0.0.1:8000/getVehicleWithRelations?id=${vehicleId}`, {
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
                <h1 class="card-title">${data.manufacturer} ${data.model} ${data.releaseYear} ${data.fuelType.fuelType}</h1>`;
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
    const fuelTypeSelect = form.querySelector('select'); 

    inputs.forEach(input => {
        formData[input.id] = input.value;
    });
    formData.fuelTypeId = fuelTypeSelect.value;

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
                getVehicles();
            } else {
                showAlert("Klaida: negalima sukurti įrašo");
            }
        })
        .catch(error => {
            console.error("Error creating vehicle:", error);
            showAlert("Klaida: negalima sukurti įrašo");
        });
}

function deleteVehicle(vehicleId) {
    fetch(`http://127.0.0.1:8000/deleteVehicle`, {
        method: "POST",
        body: JSON.stringify({ id: vehicleId }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                showAlert("Įrašas ištrintas");
                getVehicles();
            } else {
                showAlert("Klaida: negalima sukurti įrašo");
            }
        })
        .catch(error => {
            console.error("Error deleting vehicle:", error);
        });
}

function updateVehicle(vehicleId) {
    fetch(`http://127.0.0.1:8000/getVehicle?id=${vehicleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const editForm = document.getElementById("editForm");
            editForm.innerHTML = `
                <div class="form-group">
                    <label for="manufacturer">Manufacturer</label>
                    <input type="text" class="form-control" id="manufacturer" value="${data.manufacturer}">
                </div>
                <div class="form-group">
                    <label for="model">Model</label>
                    <input type="text" class="form-control" id="model" value="${data.model}">
                </div>
                <div class="form-group">
                    <label for="releaseYear">Release Year</label>
                    <input type="text" class="form-control" id="releaseYear" value="${data.releaseYear}">
                </div>
                <div class="form-group">
                    <label for="fuelType">Fuel Type</label>
                    <select class="form-control" id="fuelTypeSelect">
                        <option value=""></option>
                    </select>
                </div>
                <button type="button" class="btn btn-success" id="submitUpdateVehicle">Update</button>
            `;
            getFuelTypesForVehicleEdit();

            document.getElementById("submitUpdateVehicle").addEventListener('click', () => {
                let formData = {};
                const inputs = editForm.querySelectorAll('input');
                const fuelTypeSelect = editForm.querySelector('select');

                inputs.forEach(input => {
                    formData[input.id] = input.value;
                });
                formData.id = vehicleId;
                formData.fuelTypeId = fuelTypeSelect.value;

                fetch(`http://127.0.0.1:8000/updateVehicle`, {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            showAlert("Įrašas atnaujintas");
                            getVehicles();
                            document.getElementById("editForm").innerHTML = "";
                        } else {
                            showAlert("Klaida: negalima atnaujinti įrašo");
                        }
                    })
                    .catch(error => {
                        console.error("Error updating vehicle:", error);
                    });
            });
        })
        .catch(error => {
            console.error("Error getting vehicle:", error);
            showAlert("Klaida: negalima gauti įrašo");
        });
}