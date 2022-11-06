
const titleFeild = document.getElementById('title-input');
const priceFeild = document.getElementById('price-input');
const taxFeild = document.getElementById('tax-input');
const discountFeild = document.getElementById('discount-input');
const countFeild = document.getElementById('count-input');
const categoryFeild = document.getElementById('category-input');
const searchFeild = document.getElementById('search-input');

const totalTag = document.getElementById('total-tag');
const totalValueSpan = document.getElementById('total-value');

const createButton = document.getElementById('create-button');
const searchTitleButton = document.getElementById('search-title-button');
const searchCategoryButton = document.getElementById('search-category-button');
const deleteAllButton = document.getElementById('deleteAll-button');
const deleteAllSpan = document.getElementById('delete-all-span');
const mainTable = document.getElementById('main-table');

createButton.addEventListener('click', createRow);
searchTitleButton.addEventListener('click', search);
searchCategoryButton.addEventListener('click', search);
deleteAllButton.addEventListener('click', deleteAll);

let rowsData;
const savedRows = JSON.parse(localStorage.getItem('cruds11'));

if (Array.isArray(savedRows)) {
  rowsData = savedRows;
} else rowsData = [{
  id: 1,
  title: 'sony',
  price: 1000,
  tax: 100,
  discount: 50,
  total: 1150,
  count: 3,
  category: 'phone'
}];

console.log(rowsData);
let ID;
if (rowsData.length === 0) {
  ID = 0;
} else {
  ID = rowsData[rowsData.length - 1].id;
}
console.log("This is the id " + ID);

let total = 100;
let currentUpdateId = 0;

// this method will load the data only the first time
render(rowsData);
updateCounterSpan();

function getTotal() {
  let price  = priceFeild.value;
  let tax = taxFeild.value;
  let discount = discountFeild.value;

  if (price === "") {
    totalTag.style = "background-color: rgb(166, 49, 49)"
    totalValueSpan.innerHTML = "";
  } else {
    totalTag.style = "background-color: rgb(36, 153, 36)"
    total = +price + ((+tax * +price)/100) - +discount;
    total = Math.round(total * 100) / 100;
    totalValueSpan.innerHTML = total;
  }
}

function createRow() {
  if (!mandatoryFeildsempty()) {
    alert('some required fields are empty');
  } else {
    if (createButton.innerText == 'Create') {
      ID++;
      console.log("This is the id " + ID);

      rowsData.push({
        id: ID,
        title: titleFeild.value,
        price: priceFeild.value,
        tax: taxFeild.value,
        discount: discountFeild.value,
        total: total,
        count: countFeild.value,
        category: categoryFeild.value
      });
      console.log("id is: " + rowsData[rowsData.length - 1].id);
      if (searchFeild.value === '') {
        addRow(rowsData, ID - 1);
      }
      console.log(rowsData);
    } else {

      // change here
      const tableRow = mainTable.rows[getIndex(currentUpdateId)];

      const arrayRow = rowsData[currentUpdateId - 1]
      arrayRow.id = currentUpdateId;
      arrayRow.title = titleFeild.value,
      arrayRow.price = priceFeild.value,
      arrayRow.tax = taxFeild.value,
      arrayRow.discount = discountFeild.value,
      arrayRow.total = total,
      arrayRow.count = countFeild.value,
      arrayRow.category = categoryFeild.value

      linkBackFront(tableRow, arrayRow)

      createButton.innerText = 'Create';
      currentUpdateId = 0;
    }
    clearFields();
    saveData();

    totalTag.style = "background-color: rgb(166, 49, 49)";
    totalValueSpan.innerHTML = "";

    updateCounterSpan();
  }
}
function mandatoryFeildsempty() {
  if (titleFeild.value == "" || priceFeild.value == "" ||
    taxFeild.value == "" || categoryFeild.value == "") {
    return false;
  } else return true;
}
function clearFields() {
  titleFeild.value = "";
  priceFeild.value = "";
  taxFeild.value = "";
  discountFeild.value = "";
  countFeild.value = "";
  categoryFeild.value = "";
}
function updateRow(view) {
  console.log("this is the index" + getIndex(getId(view)));
  // change here
  const row = mainTable.rows[getIndex(getId(view))];
  const cells = row.getElementsByTagName("td");

  titleFeild.value = cells[1].innerText;
  priceFeild.value = cells[2].innerText;
  taxFeild.value = cells[3].innerText.slice(0, -1);
  discountFeild.value = cells[4].innerText;
  totalValueSpan.value = cells[5].innerText;
  totalTag.style = "background-color: rgb(166, 49, 49)";
  total = parseInt(cells[5].innerText);
  countFeild.value = cells[6].innerText;
  categoryFeild.value = cells[7].innerText;

  createButton.innerText = 'Update';
  currentUpdateId = getId(view);

  getTotal();  

}

function removeRow(view) {
  let thisID = getId(view);
  mainTable.deleteRow(getIndex(thisID));
  updateArray(thisID);
  updateInterface(thisID-1);
  ID--;

  createButton.innerText = 'Create';
  clearFields(); getTotal(); updateCounterSpan();  saveData();
}
function getId(view) {
  const ButtonId = view.target.id;
  const partsArray = ButtonId.split('-');
  let id = partsArray[partsArray.length - 1];
  return id;
}
function render(array) {
  for (let i = 0; i < array.length; i++)
    addRow(array, i);
}
function saveData() {
  localStorage.setItem('cruds11', JSON.stringify(rowsData));
}
function addRow(array, arrayIndex) {
  let row = array[arrayIndex];
  const tableRow = mainTable.insertRow();

  tableRow.insertCell(0);
  tableRow.insertCell(1);
  tableRow.insertCell(2);
  tableRow.insertCell(3);
  tableRow.insertCell(4);
  tableRow.insertCell(5);
  tableRow.insertCell(6);
  tableRow.insertCell(7);
  tableRow.insertCell(8);
  tableRow.insertCell(9);

  linkBackFront(tableRow, row);
  const cells = tableRow.getElementsByTagName("td");

  
  const updateButton = document.createElement('button');
  updateButton.innerText = 'update';
  updateButton.id = 'update-button-' + row.id;
  updateButton.className = 'update-button';
  updateButton.onclick = updateRow;
  cells[8].appendChild(updateButton);

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'delete';
  deleteButton.id = 'delete-button-' + row.id;
  deleteButton.className = 'delete-button';
  deleteButton.onclick = removeRow;
  cells[9].appendChild(deleteButton);
}

function updateInterface(startingID) {
  for (var i = startingID, row; row = mainTable.rows[i]; i++) {
    row.cells[0].innerHTML = (row.cells[0].innerText - 1);

    const updateButton = document.createElement('button');
    updateButton.innerText = 'update';
    updateButton.id = 'update-button-' + (row.cells[0].innerText);
    updateButton.className = 'update-button';
    updateButton.onclick = updateRow;
    row.cells[8].innerHTML = "";
    row.cells[8].appendChild(updateButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';
    deleteButton.id = 'delete-button-' + (row.cells[0].innerText);
    deleteButton.className = 'delete-button';
    deleteButton.onclick = removeRow;
    row.cells[9].innerHTML = "";
    row.cells[9].appendChild(deleteButton);

 }
}

function updateArray(thisID) {
  for (const row of rowsData) {
    if (row.id > thisID) {
      row.id = row.id - 1;
    }
  }
  console.log(rowsData);

  rowsData.splice(thisID-1, 1);

  console.log(rowsData);

}
function linkBackFront(tableRow, arrayRow) {
  const cells = tableRow.getElementsByTagName("td");
  cells[0].innerHTML = arrayRow.id;
  cells[1].innerHTML = arrayRow.title;
  cells[2].innerHTML = arrayRow.price;
  cells[3].innerHTML = arrayRow.tax + "%";
  cells[4].innerHTML = arrayRow.discount;
  cells[5].innerHTML = arrayRow.total;
  cells[6].innerHTML = arrayRow.count;
  cells[7].innerHTML = arrayRow.category;

  if (arrayRow.discount == "") {
    cells[4].innerHTML = 0;
  } else cells[4].innerHTML = arrayRow.discount;
  if (arrayRow.count == "") {
    cells[6].innerHTML = 1;
  } else cells[6].innerHTML = arrayRow.count;

}

function deleteAll() {
  // removing rows from backend
  rowsData = [];
  // removing rows from frontend
  mainTable.innerHTML = '';
  ID = 0;

  createButton.innerText = 'Create';
  clearFields(); getTotal(); updateCounterSpan();  saveData();
}

function search(view) {
  const parsedIDArray = view.target.id.split('-');
  let searcthType = parsedIDArray[parsedIDArray.length - 2];

  let array = [];

  if (searchFeild.value != "") {
    let fieldLength = searchFeild.value.length;
    if (searcthType === 'title'){

      for (let row of rowsData) {
        if (row.title.length === fieldLength) {
          if (row.title === searchFeild.value) {
            array.push(row);
          }
        } else if (row.title.length > fieldLength) {
          deepSearch(searcthType, array, row, fieldLength);
        }
      }
    } else if (searcthType === 'category') {
      for (let row of rowsData) {
        if (row.category.length === fieldLength) {
          if (row.category === searchFeild.value) {
            array.push(row);
          }
        } else if (row.category.length > fieldLength) {
          deepSearch(searcthType, array, row, fieldLength);
        }
      }
    }
    
    console.log(array);
    if (array.length === 0) {
      alert('No rows found');
    } else {
      //this will remove the initial rows
      mainTable.innerHTML = '';

      // this will add the rows to the table
      render(array);
      
    }
  } else {
    alert('search field is empty');
  }

  
}
function searchEmpty() {
  if (searchFeild.value === "" ) {
    mainTable.innerHTML = '';
    render(rowsData);
  }
}

function updateCounterSpan() {
  let counter = 0;
  for (let row of rowsData) {
    counter = counter + +row.count;
  }
  deleteAllSpan.innerHTML = counter + ' items';
}

function getIndex(itemId) {
  if (mainTable.rows.length === 1) {
    return 0;
  } else {
    for (let index = 0; index < mainTable.rows.length; index++) {
      const cells = mainTable.rows[index].getElementsByTagName("td");
      if (cells[0].innerText === itemId) {
        return index;
      }
    }
  }
} 

function deepSearch( type, array, row, fieldLength) {
  let searchingArray = [];
  let value = "";
  if (type === 'title') {
     value = row.title;
  } else {
    value = row.category;
  }
  let fieldValue = searchFeild.value;
  let reps = value.length - fieldLength + 1;

  console.log("This is reps " + reps);

  for (let i = 0; i < reps; i++) {
    searchingArray.push(value.substring(i, fieldLength + i));
  }
  console.log("this is searchingArray " + searchingArray);

  for (let element of searchingArray) {
    if (element === fieldValue) {
      array.push(row);
      break;
    }
  }
}