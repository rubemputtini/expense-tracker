const subcategories = {
    "Habitação": ["Aluguel/Prestação", "Condomínio", "IPTU + Taxas Municipais", "Conta de energia", "Conta de água", "Telefones celulares", "TV e Internet", "Supermercado", "Empregados", "Lavanderia", "Outros"],
    "Saúde": ["Plano de Saúde", "Médicos e terapeutas", "Medicamentos", "Outros"],
    "Transporte": ["Prestação", "Seguro", "Combustível", "Estacionamentos", "Lavagens", "Mecânico", "Multas", "Transporte Público", "Táxi/Uber", "Outros"],
    "Despesas Pessoais": ["Cabeleireiro", "Vestuário", "Academia", "Outros"],
    "Educação": ["Cursos", "Livros", "Outros"],
    "Lazer": ["Restaurantes", "Bares e boates", "Games", "Passagens", "Hospedagens", "Passeios", "Outros"],
    "Despesas Temporárias/Variáveis": ["Eletrodomésticos/Eletrônicos", "Presentes", "Manutenção e reparos"]
};

const CATEGORY_DROPDOWN = document.getElementById("expense-category");
const SUBCATEGORIES_DROPDOWN = document.getElementById("expense-subcategory");
const EXPENSE_AMOUNT = document.getElementById("expense-amount");
const EXPENSE_DATE = document.getElementById("expense-date");
const REGISTER_BTN = document.getElementById("register-btn");
const EXPENSES_BODY = document.getElementById("expenses-body");
const TOTAL_AMOUNT_CELL = document.getElementById("total-amount");
const ERROR_MESSAGE = document.getElementById("error-message");

let expenses = [];
let totalAmount = 0;

window.onload = function() {
    showSubcategories();
};

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("expense-date").value = today;
});

CATEGORY_DROPDOWN.addEventListener('change', showSubcategories);

REGISTER_BTN.addEventListener('click', registerExpense);

function showSubcategories() {
    SUBCATEGORIES_DROPDOWN.innerHTML = "";
    const category = CATEGORY_DROPDOWN.value;
    subcategories[category].forEach(subcategory => {
      const option = document.createElement("option");
      option.text = subcategory;
      SUBCATEGORIES_DROPDOWN.add(option);
    });
}

function registerExpense(event) {
    event.preventDefault();

    if (!validateExpenseForm()) {
        return;
    };
    
    const category = CATEGORY_DROPDOWN.value;
    const subcategory = SUBCATEGORIES_DROPDOWN.value;
    const amount = Number(EXPENSE_AMOUNT.value);
    const date = EXPENSE_DATE.value;

    const expense = { category, subcategory, amount, date };
    expenses.push(expense);

    totalAmount += amount;
    TOTAL_AMOUNT_CELL.textContent = formatCurrency(totalAmount);

    addExpenseRow(expense);

    document.getElementById("expense-form").reset();

    calendar.addEvent(convertExpenseToEvent(expense));
    calendar.render();
}

function validateExpenseForm() {
    const category = CATEGORY_DROPDOWN.value;
    const subcategory = SUBCATEGORIES_DROPDOWN.value;
    const amount = Number(EXPENSE_AMOUNT.value);
    const date = EXPENSE_DATE.value;

    ERROR_MESSAGE.textContent = "";

    if (!category || !subcategory || !amount || !date) {
        ERROR_MESSAGE.textContent = "Por favor, preencha todos os campos.";
        return false;
    }

    if (isNaN(amount) || amount <= 0) {
        ERROR_MESSAGE.textContent = "O valor deve ser um número válido e maior que zero.";
        return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(dateRegex) || isNaN(new Date(date))) {
        ERROR_MESSAGE.textContent = "A data deve ser uma data válida.";
        return false;
    }

    return true;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(date) {
    // Converter a data de AAAA-MM-DD para DD/MM/AAAA
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

function addExpenseRow(expense) {
    const newRow = EXPENSES_BODY.insertRow();
    const cells = [expense.category, expense.subcategory, formatCurrency(expense.amount), formatDate(expense.date)];
    cells.forEach((value, index) => {
        const cell = newRow.insertCell();
        cell.textContent = value;
    });

    const actionCell = newRow.insertCell();
    const editIcon = createIcon('fas fa-edit edit-btn', () => editExpense(expense, newRow));
    const deleteIcon = createIcon('fas fa-trash-alt delete-btn', () => deleteExpense(expense, newRow));
    
    actionCell.appendChild(editIcon);
    actionCell.appendChild(deleteIcon);
}

function createIcon(classes, clickHandler) {
    const icon = document.createElement("i");
    icon.classList.add(...classes.split(' '));
    icon.addEventListener('click', clickHandler);
    return icon;
}

function deleteExpense(expense, row) {
    totalAmount -= expense.amount;
    TOTAL_AMOUNT_CELL.textContent = formatCurrency(totalAmount);
    
    expenses.splice(expenses.indexOf(expense), 1);
    row.remove();
}

function editExpense(expense, row) {
    CATEGORY_DROPDOWN.value = expense.category;
    showSubcategories();
    SUBCATEGORIES_DROPDOWN.value = expense.subcategory;
    EXPENSE_AMOUNT.value = expense.amount;
    EXPENSE_DATE.value = expense.date;

    const index = expenses.indexOf(expense);
    if (index !== -1) {
        expenses.splice(index, 1);
    }

    totalAmount -= expense.amount;
    TOTAL_AMOUNT_CELL.textContent = formatCurrency(totalAmount);

    row.remove();
}

var calendar;

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var categoryColors = {
        "Saúde": 'lightblue',
        "Transporte": 'lightgreen',
        "Habitação": 'lightcoral',
        "Despesas Pessoais": 'lightsalmon',
        "Educação": 'lightseagreen',
        "Lazer": 'lightpink',
        "Despesas Temporárias/Variáveis": 'lightsteelblue'
    };

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: window.innerWidth < 768 ? 'dayGridDay' : 'dayGridWeek', // Altera a visualização padrão com base no tamanho da tela
        events: [],
        eventDidMount: function(info) {
            console.log("Evento montado:", info);

            var category = info.event.extendedProps.category;
            var color = categoryColors[category];
            
            if (color) {
                info.el.style.backgroundColor = color;
            }

            var description = info.event.extendedProps.description;
            if (description) {
                var descriptionEl = document.createElement('div');
                descriptionEl.textContent = description;
                info.el.appendChild(descriptionEl);
            }
        }
    });

    calendar.render();
});

function convertExpenseToEvent(expense) {
    return {
        title: expense.subcategory,
        description: formatCurrency(expense.amount),
        start: expense.date,
        allDay: true,
        extendedProps: {
            category: expense.category,
            amount: expense.amount
        }
    };
}

window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        calendar.changeView('dayGridDay');
    } else {
        calendar.changeView('dayGridWeek');
    }
});