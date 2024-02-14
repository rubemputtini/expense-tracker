const subcategories = {
    "housing": ["Aluguel/Prestação", "Condomínio", "IPTU + Taxas Municipais", "Conta de energia", "Conta de água", "Telefones celulares", "TV e Internet", "Supermercado", "Empregados", "Lavanderia", "Outros"],
    "health": ["Plano de Saúde", "Médicos e terapeutas", "Medicamentos", "Outros"],
    "transport": ["Prestação", "Seguro", "Combustível", "Estacionamentos", "Lavagens", "Mecânico", "Multas", "Transporte Público", "Táxi/Uber", "Outros"],
    "personal": ["Cabeleireiro", "Vestuário", "Academia", "Outros"],
    "education": ["Cursos", "Livros", "Outros"],
    "leisure": ["Restaurantes", "Bares e boates", "Games", "Passagens", "Hospedagens", "Passeios", "Outros"],
    "temporary": ["Eletrodomésticos/Eletrônicos", "Presentes", "Manutenção e reparos"]
};

let expenses = [];
let totalAmount = 0;

const categoryDropdown = document.getElementById("expense-category");
const subcategoriesDropdown = document.getElementById("expense-subcategory");
const expenseAmount = document.getElementById("expense-amount");
const expenseDate = document.getElementById("expense-date");
const registerBtn = document.getElementById("register-btn");
const expensesBody = document.getElementById("expenses-body");
const totalAmountCell = document.getElementById("total-amount");

function showSubcategories() {
    subcategoriesDropdown.innerHTML = "";
    const category = categoryDropdown.value;
    subcategories[category].forEach(subcategory => {
      const option = document.createElement("option");
      option.text = subcategory;
      subcategoriesDropdown.add(option);
    });
  }

window.onload = function() {
    showSubcategories();
  };

registerBtn.addEventListener('click', function(event) {
    event.preventDefault();

    if (!validateExpenseForm()) {
        return;
    };
    
    const category = categoryDropdown.value;
    const subcategory = subcategoriesDropdown.value;
    const amount = Number(expenseAmount.value);
    const date = expenseDate.value;


    const expense = { category, subcategory, amount, date };
    expenses.push(expense);

    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expensesBody.insertRow();

    const categoryCell = newRow.insertCell();
    const subCategoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = 'Apagar';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', function() {
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;
        
        expenses.splice(expenses.indexOf(expense), 1);
        expensesBody.removeChild(newRow);
    })

    categoryCell.textContent = expense.category;
    subCategoryCell.textContent = expense.subcategory;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);

    document.getElementById("expense-form").reset();
});

function validateExpenseForm() {
    const category = document.getElementById("expense-category").value;
    const subcategory = document.getElementById("expense-subcategory").value;
    const amount = document.getElementById("expense-amount").value;
    const date = document.getElementById("expense-date").value;

    if (!category || !subcategory || !amount || !date) {
        alert("Por favor, preencha todos os campos.");
        return false;
    }

    if (isNaN(amount)) {
        alert("O valor deve ser um número válido.");
        return false;
    }

    document.getElementById("expense-form").reset();

    return true;
}
