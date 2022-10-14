
const API_URL = 'http://localhost:3000/personas';
let personas = [];
let deleteId = null;

window.addEventListener('DOMContentLoaded', () => {
  getPersonas();
})

const getPersonas = () => {
  fetch(API_URL)
  .then(response => response.json())
  .catch(error => {
    alertManager('error', 'Ocurrión un problema al cargar los productos');
  })  
  .then(data => {
    personas = data.data;
    renderResult(personas);
  })
}

const personasList = document.querySelector('#personasList');

const renderResult = (personas) => {
  let listHTML = "";
  personas.forEach(persona => {
    listHTML += `
      <div class="card">
        <div>Nombre: ${persona.Nombre}</div>
        <div>Apellido: ${persona.Apellido}</div>
        <div>Edad: ${persona.Edad} años</div>
        <div class="options">
          <button class="btnEdit" type="button" onclick="editPersona(${persona.Id})">Editar</button>
          <button class="btnRemove" type="button" onclick="openModalConfirm(${persona.Id})">Eliminar</button>
        </div>
      </div>
    `
  })
  personasList.innerHTML = listHTML;
}

const createPersona = () => {
  const formData = new FormData(document.querySelector('#formAdd'));

  if(!formData.get('nombre').length || !formData.get('apellido') || !formData.get('edad')) {
    document.querySelector('#msgFormAdd').innerHTML = '* Llena todos los campos';
    return;
  }
  document.querySelector('#msgFormAdd').innerHTML = '';

  const persona = {
    Nombre: formData.get('nombre'),
    Apellido: formData.get('apellido'),
    Edad: formData.get('edad'),
  }

  console.log(persona)

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(persona),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
    document.querySelector('#formAdd').reset();
  })
  .then(response => {
    alertManager('success', response.mensaje);
    closeModalAdd();
    getPersonas();
  })
}

const editPersona = (id) => {
  let persona = {};
  personas.filter(prod => {
    if(prod.Id == id){
      persona = prod
    }
  });

  document.querySelector('#formEdit #ID').value = persona.Id;
  document.querySelector('#formEdit #nombre').value = persona.Nombre;
  document.querySelector('#formEdit #apellido').value = persona.Apellido;
  document.querySelector('#formEdit #edad').value = persona.Edad;

  console.log(persona);
  openModalEdit();
}

const updatePersona= () => {
  const persona = {
    Nombre: document.querySelector('#formEdit #nombre').value,
    Apellido: document.querySelector('#formEdit #apellido').value,
    Edad: document.querySelector('#formEdit #edad').value,
    Id: document.querySelector('#formEdit #ID').value,
  }

  if(!persona.Nombre || !persona.Apellido || !persona.Edad) {
    document.querySelector('#msgFormEdit').innerHTML = '* Los campos no deden estar vacios';
    return;
  }
  document.querySelector('#msgFormEdit').innerHTML = '';

  fetch(API_URL, {
    method: 'PUT',
    body:JSON.stringify(persona),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
  })
  .then(response => {
    alertManager('success', response.mensaje);
    closeModalEdit();
    getPersonas();
  });
  document.querySelector('#formEdit').reset();
}

const deletePersona = (id) => {

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
  })
  .then(response => {
    alertManager('success', response.mensaje);
    closeModalConfirm();
    getPersonas();
    deleteId = null;
  })

}

const confirmDelete = (res) => {
  if(res){
    deletePersona(deleteId);
  } else {
    closeModalConfirm();
  }
}


// Administrador de ventana Modal
/** --------------------------------------------------------------- */
const btnAdd = document.querySelector('#btnAdd');
const modalAdd = document.querySelector('#modalAdd');

btnAdd.onclick = () => openModalAdd();

window.onclick = function(event) {
  if (event.target == modalAdd) {
    //modalAdd.style.display = "none";
  }
}

const closeModalAdd = () => {
  modalAdd.style.display = 'none';
}

const openModalAdd = () => {
  modalAdd.style.display = 'block';
}

// Administrador de ventana Modal
/** --------------------------------------------------------------- */
const modalEdit = document.querySelector('#modalEdit');

const openModalEdit = () => {
  modalEdit.style.display = 'block';
}

const closeModalEdit = () => {
  modalEdit.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modalEdit) {
    //modalEdit.style.display = "none";
  }
}

// Administrador de ventana Modal
/** --------------------------------------------------------------- */
const modalConfirm = document.getElementById('modalConfirm');

window.onclick = function(event) {
  if (event.target == modalConfirm) {
    modalConfirm.style.display = "none";
  }
}

const closeModalConfirm = () => {
  modalConfirm.style.display = 'none';
}

const openModalConfirm = (id) => {
  deleteId = id;
  modalConfirm.style.display = 'block';
}


/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector('#alert');

  alert.innerHTML = message || 'Se produjo cambios';
  alert.classList.add(typeMsg);
  alert.style.display = 'block';

  setTimeout(() => {
    alert.style.display = 'none';
    alert.classList.remove(typeMsg);
  }, 3500);

}