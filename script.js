const subcategories = {
    "Habitação": ["Aluguel/Prestação", "Condomínio", "IPTU + Taxas Municipais", "Conta de energia", "Conta de água", "Telefones celulares", "TV e Internet", "Supermercado", "Empregados", "Lavanderia", "Outros"],
    "Saúde": ["Plano de Saúde", "Médicos e terapeutas", "Medicamentos", "Outros"],
    "Transporte": ["Prestação", "Seguro", "Combustível", "Estacionamentos", "Lavagens", "Mecânico", "Multas", "Transporte Público", "Táxi/Uber", "Outros"],
    "Despesas Pessoais": ["Cabeleireiro", "Vestuário", "Academia", "Outros"],
    "Educação": ["Cursos", "Livros", "Outros"],
    "Lazer": ["Restaurantes", "Bares e boates", "Games", "Passagens", "Hospedagens", "Passeios", "Outros"],
    "Despesas Temporárias/Variáveis": ["Eletrodomésticos/Eletrônicos", "Presentes", "Manutenção e reparos"]
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
    totalAmountCell.textContent = formatCurrency(totalAmount);

    const newRow = expensesBody.insertRow();
    const cells = [category, subcategory, formatCurrency(amount), date];
    cells.forEach((value, index) => {
        const cell = newRow.insertCell();
        cell.textContent = value;
    });

    const actionCell = newRow.insertCell();
    const editIcon = document.createElement("i");
    editIcon.classList.add('fas', 'fa-edit', 'edit-btn');
    editIcon.addEventListener('click', function() {
        editExpense(expense, newRow);
    });
    
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-btn');
    deleteIcon.addEventListener('click', function() {
        deleteExpense(expense, newRow);
    });
    actionCell.appendChild(editIcon);
    actionCell.appendChild(deleteIcon);

    document.getElementById("expense-form").reset();
});

function validateExpenseForm() {
    const category = document.getElementById("expense-category").value;
    const subcategory = document.getElementById("expense-subcategory").value;
    const amount = Number(document.getElementById("expense-amount").value);
    const date = document.getElementById("expense-date").value;

    const errorElement = document.getElementById("error-message");
    errorElement.textContent = "";

    if (!category || !subcategory || !amount || !date) {
        errorElement.textContent = "Por favor, preencha todos os campos.";
        return false;
    }

    if (isNaN(amount)) {
        errorElement.textContent = "O valor deve ser um número válido.";
        return false;
    }

    return true;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function deleteExpense(expense, row) {
    totalAmount -= expense.amount;
    totalAmountCell.textContent = formatCurrency(totalAmount);
    
    expenses.splice(expenses.indexOf(expense), 1);
    row.remove();
}

function editExpense(expense, row) {
    categoryDropdown.value = expense.category;
    showSubcategories();
    subcategoriesDropdown.value = expense.subcategory;
    expenseAmount.value = expense.amount;
    expenseDate.value = expense.date;

    const index = expenses.indexOf(expense);
    if (index !== -1) {
        expenses.splice(index, 1);
    }

    totalAmount -= expense.amount;
    totalAmountCell.textContent = formatCurrency(totalAmount);

    row.remove();
}