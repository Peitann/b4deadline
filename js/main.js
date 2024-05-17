"use strict";

let budgetAmount = 0;
let pemasukkan = 0;
let expensesList = [];
let myChart; // Inisialisasi variabel myChart

function updateChartData() {
  const budgetAmount = parseFloat(
    document.querySelector(".budget_card").textContent
  );
  const totalExpenses = parseFloat(
    document.querySelector(".expenses_card").textContent
  );

  // Hitung persentase expenses terhadap Your Wallet
  const expensesPercentage = (totalExpenses / budgetAmount) * 100;
  // Update chart data
  myChart.data.datasets[0].data = [
    expensesPercentage,
    100 - expensesPercentage,
  ];
  myChart.update(); // Update the chart

  // Simpan data chart ke localStorage
  saveChartToLocalStorage();
}

// Fungsi untuk menyimpan data chart ke localStorage
function saveChartToLocalStorage() {
  const chartData = {
    expensesPercentage: myChart.data.datasets[0].data[0],
  };
  localStorage.setItem("chartData", JSON.stringify(chartData));
}

function updateLocalStorage() {
  const dataToSave = {
    budgetAmount: budgetAmount,
    pemasukkan: pemasukkan,
    expensesList: expensesList,
  };

  localStorage.setItem("moneyTrackerData", JSON.stringify(dataToSave));
}

function updateBudget() {
  document.querySelector(".budget_card").textContent = budgetAmount.toFixed(2);
  pemasukkan = budgetAmount;
  updateBalance();
  updateChartData();
  updateLocalStorage();
  updatePemasukkan();
}

function updateBalance() {
  const totalExpenses = getTotalExpenses();
  const balance = budgetAmount - totalExpenses;
  document.querySelector(".expenses_card").textContent =
    totalExpenses.toFixed(2);
  document.querySelector(".balance_card").textContent = balance.toFixed(2);

  // Update Your Wallet, Expenses, and Balance in Recap sections
  document.querySelectorAll(".wallet_amount").forEach((element) => {
    element.textContent = budgetAmount.toFixed(2);
  });
  document.querySelectorAll(".expenses_amount").forEach((element) => {
    element.textContent = totalExpenses.toFixed(2);
  });
  document.querySelectorAll(".balance_amount").forEach((element) => {
    element.textContent = balance.toFixed(2);
  });
}

function getTotalExpenses() {
  return expensesList.reduce((total, expense) => total + expense.amount, 0);
}

function updateBudgetDetails() {
  const tblData = document.querySelector(".tbl_data");
  tblData.innerHTML = ""; // Clear data before adding new ones

  expensesList.forEach((expense, index) => {
    const row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = `
    <div class ="incell">
    <div class="cell">${index + 1}</div>
    <div class="cell">${expense.description}</div>
    <div class="cell">Rp${expense.amount.toFixed(2)}</div>
    <div class="cell">${expense.date}</div>
    <div class="cell">
      <button class="edit" onclick="editExpense(${index})">Edit</button>
      <button class="delete" onclick="deleteExpense(${index})">Delete</button>
    </div>
  </div>
    `;
    tblData.appendChild(row);
  });

  // Rekap pengeluaran harian, mingguan, dan bulanan
  updateDailyTotal();
  updateWeeklyTotal();
  updateMonthlyTotal();
  updatePemasukkan();
}

function updateDailyTotal() {
  const today = new Date().toISOString().slice(0, 10);
  const dailyExpenses = expensesList.filter(
    (expense) => expense.date.slice(0, 10) === today
  );
  const dailyTotal = dailyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  document.getElementById("dailyTotal").textContent = `Rp${dailyTotal.toFixed(
    2
  )}`;
}

function updateWeeklyTotal() {
  const selectedWeek = document.getElementById("weekSelect").value;
  const weeklyExpenses = expensesList.filter(
    (expense) => getWeekNumber(new Date(expense.date)) == selectedWeek
  );
  const weeklyTotal = weeklyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  document.getElementById("weeklyTotal").textContent = `Rp${weeklyTotal.toFixed(
    2
  )}`;
}

function updateMonthlyTotal() {
  const selectedMonth = document.getElementById("monthSelect").value;
  const monthlyExpenses = expensesList.filter(
    (expense) => new Date(expense.date).getMonth() + 1 == selectedMonth
  );
  const monthlyTotal = monthlyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  document.getElementById(
    "monthlyTotal"
  ).textContent = `Rp${monthlyTotal.toFixed(2)}`;
}

function addExpense(description, amount) {
  const date = document.getElementById("expenseDate").value; // Mengambil tanggal dari input
  const expense = { description, amount, date, deleted: false };
  expensesList.push(expense);
  updateLocalStorage(); // Save to local storage
}

function editExpense(index) {
  const editedDescription = prompt("Enter edited description:");
  const editedAmount = parseFloat(prompt("Enter edited amount:"));
  if (
    editedDescription.trim() !== "" &&
    !isNaN(editedAmount) &&
    editedAmount > 0
  ) {
    expensesList[index].description = editedDescription;
    expensesList[index].amount = editedAmount;
    updateBudgetDetails();
    updateBalance();
    updateChartData();
    updateLocalStorage(); // Save to local storage
  } else {
    alert("Invalid input! Please enter valid description and amount.");
  }
}

function deleteExpense(index) {
  const isConfirmed = confirm("Are you sure you want to delete this expense?");
  if (isConfirmed) {
    const deletedExpenseAmount = expensesList[index].amount;
    expensesList.splice(index, 1); // Menghapus elemen dari array menggunakan splice
    updateBudgetDetails(); // Perbarui tampilan detail anggaran
    updateBalance(); // Perbarui saldo dan total pengeluaran
    updateChartData(); // Perbarui data chart
    updateLocalStorage(); // Simpan perubahan ke localStorage
  }
}

function addBudget(amount) {
  if (!isNaN(amount) && amount > 0) {
    budgetAmount += amount;
    pemasukkan = budgetAmount;
    updateBudget();
    updateBalance();
    updateChartData();
    updateLocalStorage();
    updatePemasukkan();
    document.querySelector(".error_message").style.display = "none";
  } else {
    document.querySelector(".error_message").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const savedData = localStorage.getItem("moneyTrackerData");

  if (savedData) {
    const parsedData = JSON.parse(savedData);
    budgetAmount = parseFloat(parsedData.budgetAmount) || 0;
    pemasukkan = parseFloat(parsedData.pemasukkan) || 0;
    expensesList = parsedData.expensesList || [];
    updateBudgetDetails();
    updateBalance();
  } else {
    updateBudget();
  }
});

// Inisialisasi chart setelah DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  myChart = new Chart(document.getElementById("myChart"), {
    type: "doughnut",
    data: {
      labels: ["Expenses", "Your Wallet"],
      datasets: [
        {
          data: [0, 100], // Dimulai dengan total pengeluaran 0
          backgroundColor: ["#F2D096", "#99ccff"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              family: "Arial",
            },
          },
          display: false,
        },
        title: {
          fontFamily: "sans-serif",
        },
      },
    },
  });

  // Cek apakah ada data chart yang disimpan di localStorage
  const savedChartData = localStorage.getItem("chartData");
  if (savedChartData) {
    const parsedChartData = JSON.parse(savedChartData);
    myChart.data.datasets[0].data[0] = parsedChartData.expensesPercentage;
    myChart.data.datasets[0].data[1] = 100 - parsedChartData.expensesPercentage;
    myChart.update(); // Update the chart
  }
});

// Fungsi untuk mendapatkan nomor minggu dalam tahun
function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return result;
}

function updatePemasukkan() {
  document.querySelector(".budget_card").textContent = pemasukkan.toFixed(2);
}

function downloadTransactions(type) {
  let transactions = [];
  let filename = "";
  let header = "Date,Description,Amount"; // Header untuk CSV

  // Menyaring transaksi berdasarkan jenis yang dipilih
  switch (type) {
    case "daily":
      transactions = expensesList.filter(
        (expense) =>
          expense.date.slice(0, 10) === new Date().toISOString().slice(0, 10)
      );
      filename = "daily_transactions.csv";
      break;
    case "weekly":
      const selectedWeekNumber = document.getElementById("weekSelect").value;
      transactions = expensesList.filter(
        (expense) => getWeekNumber(new Date(expense.date)) == selectedWeekNumber
      );
      filename = "weekly_transactions.csv";
      break;
    case "monthly":
      const selectedMonthNumber = document.getElementById("monthSelect").value;
      transactions = expensesList.filter(
        (expense) =>
          new Date(expense.date).getMonth() + 1 == selectedMonthNumber
      );
      filename = "monthly_transactions.csv";
      break;
    default:
      break;
  }

  // Menambahkan pemasukan ke daftar transaksi
  transactions.push({
    date: new Date().toISOString().slice(0, 10),
    description: "Pemasukkan",
    amount: pemasukkan,
  });

  if (transactions.length === 0) {
    alert("No transactions found for download.");
    return;
  }

  // Membuat isi CSV dengan menambahkan baris header
  const csvContent =
    "data:text/csv;charset=utf-8," +
    header +
    "\n" +
    transactions
      .map(
        (transaction) =>
          `${transaction.date},${transaction.description},${transaction.amount}`
      )
      .join("\n");

  // Menginisialisasi URL dan elemen anchor untuk mengunduh file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("budgetForm");
  const budgetInput = document.querySelector(".budget_input");
  const errorMessage = document.querySelector(".error_message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const newBudgetAmount = parseFloat(budgetInput.value);
    if (!isNaN(newBudgetAmount) && newBudgetAmount > 0) {
      budgetAmount += newBudgetAmount;
      updateBudget();
      updateBalance();
      updateChartData();
      errorMessage.style.display = "none";
      budgetInput.value = ""; // Clear input field after adding budget
    } else {
      errorMessage.style.display = "block";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const expensesForm = document.getElementById("expensesForm");

  expensesForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const description = document.querySelector(".expenses_input").value;
    const amount = parseFloat(document.querySelector(".expenses_amount").value);
    if (description.trim() !== "" && !isNaN(amount) && amount > 0) {
      addExpense(description, amount);
      updateBudgetDetails();
      updateBalance();
      updateChartData();
      document.querySelector(".expenses_input").value = ""; // Clear description input field after adding expense
      document.querySelector(".expenses_amount").value = ""; // Clear amount input field after adding expense
    } else {
      alert("Please enter a valid description and amount for the expense.");
    }
  });
});

// Event listener untuk mengupdate financial health
function updateFinancialHealth() {
  const walletAmount = parseFloat(
    document.querySelector(".wallet_amount").textContent
  );
  const expensesAmount = parseFloat(
    document.querySelector(".expenses_card").textContent
  );
  const financialHealth = document.querySelector(".finances"); // Target the finance element

  if (walletAmount > expensesAmount) {
    financialHealth.innerHTML = `
    <div class="information">
        <h2>Your Finance is Good!</h2>
        <p>Keep up the good work! You're staying within your budget.</p>
    </div>
    `;
  } else {
    financialHealth.innerHTML = `
    <div class="information">
        <h2>Your Finance is Bad!</h2>
        <p>Expenses are exceeding your wallet amount. It's time to review your spending habits.</p>
    </div>
    `;
  }
}

// Call updateFinancialHealth after updates that affect wallet or expenses:
updateFinancialHealth(); // Call initially
document.addEventListener("DOMContentLoaded", updateFinancialHealth); // Call on page load
budgetForm.addEventListener("submit", updateFinancialHealth); // Call after budget update
expensesForm.addEventListener("submit", updateFinancialHealth); // Call after expense addition

// Fungsi untuk memperbarui pemasukkan
function updatePemasukkan() {
  document.querySelector(".budget_card").textContent = pemasukkan.toFixed(2);
}

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
  const dataToSave = {
    userName: localStorage.getItem("userName") || "",
    budgetAmount: budgetAmount.toFixed(2),
    pemasukkan: pemasukkan.toFixed(2),
    expensesList: expensesList,
    currentDate: new Date().toLocaleDateString("id-ID"),
  };

  localStorage.setItem("moneyTrackerData", JSON.stringify(dataToSave));
}

// Inisialisasi opsi minggu
const weekSelect = document.getElementById("weekSelect");
const monthSelect = document.getElementById("monthSelect");

// Mengisi opsi minggu
for (let i = 1; i <= 52; i++) {
  const option = document.createElement("option");
  option.text = `Week ${i}`;
  option.value = i;
  weekSelect.appendChild(option);
}

// Mengisi opsi bulan
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
for (let i = 0; i < months.length; i++) {
  const option = document.createElement("option");
  option.text = months[i];
  option.value = i + 1; // Bulan dimulai dari 1
  monthSelect.appendChild(option);
}

// Fungsi untuk mendapatkan nomor minggu dalam tahun
function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return result;
}
