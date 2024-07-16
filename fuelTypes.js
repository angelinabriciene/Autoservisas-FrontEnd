document.getElementById('submitNewFuelType').addEventListener('click', (event) => {
    event.preventDefault();
    createFuelType(document.getElementById('fuelForm'));
});

document.getElementById('getFuelType').addEventListener('click', () => {
    getFuelType(document.getElementById('OneFuelTypeForm'));
});

function showAlert(message) {
    alert(message);
}

getFuelTypes();

function createFuelTypesList(container, data) {
    const tableBody = document.getElementById("listOfFuelTypes").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    data.forEach(fuelType => {
        const row = tableBody.insertRow();
        const idCell = row.insertCell();
        const fuelTypeCell = row.insertCell();
        const actionCell = row.insertCell();

        idCell.innerHTML = fuelType.id;
        fuelTypeCell.innerHTML = fuelType.fuelType;

        const updateButton = document.createElement("button");
        updateButton.type = "button";
        updateButton.className = "btn btn-primary";
        updateButton.innerHTML = "Update";
        updateButton.onclick = function () {
            updateFuelType(fuelType.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-danger";
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function () {
            deleteFuelType(fuelType.id);
        };

        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
    });
}

function getFuelTypes() {
    fetch("http://127.0.0.1:8000/getFuelTypes")
        .then(response => response.json())
        .then(data => {
            createFuelTypesList(document.getElementById("listOfFuelTypes"), data);
        });
}

function getFuelType(form) {
    if (!(form instanceof HTMLFormElement)) {
        console.error("Invalid form element:", form);
        return;
    }
    let formData = {};
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });
    const fuelTypeId = formData.fuelTypeIdInput;
    fetch(`http://127.0.0.1:8000/getFuelType?id=${fuelTypeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const cardBody = document.getElementById("fuelTypeCard").getElementsByClassName("card-body")[0];
            cardBody.innerHTML = "";

            const fuelTypeHTML = `
                <h1 class="card-title">${data.fuelType}</h1>`;
            cardBody.innerHTML = fuelTypeHTML;
        })
        .catch(error => {
            console.error("Error getting fuel type:", error);
            showAlert("Klaida: negalima gauti įrašo");
        });
}

function createFuelType(form) {
    if (!(form instanceof HTMLFormElement)) {
        console.error("Invalid form element:", form);
        return;
    }

    let formData = {};
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    fetch(`http://127.0.0.1:8000/createFuelType`, {
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
                getFuelTypes();
            } else {
                showAlert("Klaida: negalima sukurti įrašo");
            }
        })
        .catch(error => {
            console.error("Error creating fuel type:", error);
            showAlert("Klaida: negalima sukurti įrašo");
        });
}

function deleteFuelType(fuelTypeId) {
    fetch(`http://127.0.0.1:8000/deleteFuelType`, {
        method: "POST",
        body: JSON.stringify({ id: fuelTypeId }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                showAlert("Įrašas ištrintas");
                getFuelTypes();
            } else {
                showAlert("Klaida: negalima ištrinti įrašo");
            }
        })
        .catch(error => {
            console.error("Error deleting fuel type:", error);
        });
}

function updateFuelType(fuelTypeId) {
    fetch(`http://127.0.0.1:8000/getFuelType?id=${fuelTypeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const editFormContainer = document.getElementById("editFuelTypeForm");
            editFormContainer.innerHTML = `
                <div class="form-group">
                    <label for="fuelType">fuel type</label>
                    <input type="text" class="form-control" id="fuelType" value="${data.fuelType}">
                </div>
                <button type="button" class="btn btn-success" id="submitUpdateFuelType">Update</button>
            `;

            document.getElementById("submitUpdateFuelType").addEventListener('click', (event) => {
                event.preventDefault();
                let formData = {};
                const inputs = editFormContainer.querySelectorAll('input');
                inputs.forEach(input => {
                    formData[input.id] = input.value;
                });
                formData.id = fuelTypeId;

                fetch(`http://127.0.0.1:8000/updateFuelType`, {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            showAlert("Įrašas atnaujintas");
                            getFuelTypes();
                            document.getElementById("editFuelTypeForm").innerHTML = "";
                        } else {
                            showAlert("Klaida: negalima atnaujinti įrašo");
                        }
                    })
                    .catch(error => {
                        console.error("Error updating fuel type:", error);
                    });
            });
        })
        .catch(error => {
            console.error("Error getting fuel type:", error);
            showAlert("Klaida: negalima gauti įrašo");
        });
}