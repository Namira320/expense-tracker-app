document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi Elemen DOM berdasarkan ID dan Atribut Starter Project
  const greetingElement = document.querySelector(".tracker-header__greeting");
  const transactionForm = document.getElementById("transactionForm");

  // Input Form sesuai id/data-testid di HTML starter
  const titleInput = document.getElementById("transactionFormTitleInput");
  const amountInput = document.getElementById("transactionFormAmountInput");
  const dateInput = document.getElementById("transactionFormDateInput");
  const typeSelect = document.getElementById("transactionFormTypeSelect");

  // Form dan Input Pencarian
  const searchForm = document.getElementById("searchTransactionForm");
  const searchInput = document.getElementById(
    "searchTransactionFormTitleInput",
  );

  // Kontainer Daftar Transaksi (sesuai data-testid & id)
  const incomeList = document.getElementById("incomeList");
  const expenseList = document.getElementById("expenseList");

  // Panel Dasbor Ringkasan
  const totalBalanceEl = document.querySelector(
    ".tracker-summary__balance-amount",
  );
  const totalIncomeEl = document.querySelector(
    ".tracker-summary__stat-amount--income",
  );
  const totalExpenseEl = document.querySelector(
    ".tracker-summary__stat-amount--expense",
  );

  // Kunci Penyimpanan localStorage
  const STORAGE_KEY = "EXPENSE_TRACKER_APPS";

  // State untuk Mode Edit Transaksi
  let isEditing = false;
  let currentEditId = null;

  // Sapaan teks
  if (greetingElement) {
    greetingElement.innerHTML =
      "Halo, <strong>Namira Assalwa (namira_assalwa_EZ8B)</strong>";
  }

  // Set default tanggal hari ini pada form date jika kosong
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // 2. Fungsi Mengambil Data dari localStorage
  function getTransactions() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return [];
    try {
      return JSON.parse(serializedData);
    } catch (error) {
      console.error("Gagal memparsing data dari localStorage:", error);
      return [];
    }
  }

  // 3. Fungsi Menyimpan Data & Mengirim Custom Event (Kriteria Advanced)
  function saveAndDispatch(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

    // Mengirim sinyal Custom Event sesuai instruksi panduan
    const updateEvent = new Event("transaction:updated");
    document.dispatchEvent(updateEvent);
  }

  // 4. Format Angka ke Rupiah
  function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // 5. Membuat Elemen Kartu Transaksi menggunakan document.createElement()
  function createTransactionCard(transaction) {
    // Kontainer Utama Kartu
    const card = document.createElement("div");
    card.setAttribute("data-testid", "transactionItem");
    card.classList.add("tracker-transaction-item");

    // Ikon visual bawaan styling
    const iconDiv = document.createElement("div");
    iconDiv.classList.add("tracker-transaction-item__icon");
    if (transaction.type === "income") {
      iconDiv.classList.add("tracker-transaction-item__icon--income");
      iconDiv.textContent = "📥";
    } else {
      iconDiv.classList.add("tracker-transaction-item__icon--expense");
      iconDiv.textContent = "📤";
    }

    // Detail pembungkus teks
    const detailDiv = document.createElement("div");
    detailDiv.classList.add("tracker-transaction-item__detail");

    const titleEl = document.createElement("h3");
    titleEl.setAttribute("data-testid", "transactionItemTitle");
    titleEl.classList.add("tracker-transaction-item__title");
    titleEl.textContent = transaction.title;

    const dateEl = document.createElement("p");
    dateEl.setAttribute("data-testid", "transactionItemDate");
    dateEl.classList.add("tracker-transaction-item__date");
    dateEl.textContent = `Tanggal: ${transaction.date}`;

    detailDiv.append(titleEl, dateEl);

    // Bagian Kanan (Nominal & Tombol Aksi)
    const rightDiv = document.createElement("div");
    rightDiv.classList.add("tracker-transaction-item__right");

    const amountEl = document.createElement("p");
    amountEl.setAttribute("data-testid", "transactionItemAmount");
    amountEl.classList.add("tracker-transaction-item__amount");
    if (transaction.type === "income") {
      amountEl.classList.add("tracker-transaction-item__amount--income");
      amountEl.textContent = `+ ${formatRupiah(transaction.amount)}`;
    } else {
      amountEl.classList.add("tracker-transaction-item__amount--expense");
      amountEl.textContent = `- ${formatRupiah(transaction.amount)}`;
    }

    const typeHiddenEl = document.createElement("p");
    typeHiddenEl.setAttribute("data-testid", "transactionItemType");
    typeHiddenEl.classList.add("visually-hidden");
    typeHiddenEl.textContent = `Tipe: ${transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}`;

    // Tombol-tombol Aksi
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("tracker-transaction-item__actions");

    // Tombol Ubah Tipe
    const editTypeBtn = document.createElement("button");
    editTypeBtn.setAttribute("data-testid", "transactionItemEditTypeButton");
    editTypeBtn.classList.add("tracker-transaction-item__btn");
    editTypeBtn.textContent = "Ubah Tipe";
    editTypeBtn.addEventListener("click", () => {
      handleToggleType(transaction.id);
    });

    // Tombol Edit
    const editBtn = document.createElement("button");
    editBtn.classList.add("tracker-transaction-item__btn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      handlePrepareEdit(transaction);
    });

    // Tombol Hapus
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("data-testid", "transactionItemDeleteButton");
    deleteBtn.classList.add("tracker-transaction-item__btn");
    deleteBtn.textContent = "Hapus";
    deleteBtn.addEventListener("click", () => {
      handleDeleteTransaction(transaction.id);
    });

    actionsDiv.append(editTypeBtn, editBtn, deleteBtn);
    rightDiv.append(amountEl, typeHiddenEl, actionsDiv);

    card.append(iconDiv, detailDiv, rightDiv);
    return card;
  }

  // 6. Memperbarui Panel Dasbor Ringkasan Keuangan
  function updateDashboard(transactions) {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((item) => {
      const nominal = Number(item.amount);
      if (item.type === "income") {
        totalIncome += nominal;
      } else if (item.type === "expense") {
        totalExpense += nominal;
      }
    });

    const currentBalance = totalIncome - totalExpense;

    if (totalBalanceEl)
      totalBalanceEl.textContent = formatRupiah(currentBalance);
    if (totalIncomeEl) totalIncomeEl.textContent = formatRupiah(totalIncome);
    if (totalExpenseEl) totalExpenseEl.textContent = formatRupiah(totalExpense);
  }

  // 7. Render Seluruh Tampilan Aplikasi & Filter Pencarian
  function renderApp(searchKeyword = "") {
    const transactions = getTransactions();

    // Kosongkan kontainer sebelum mengisi ulang
    if (incomeList) incomeList.innerHTML = "";
    if (expenseList) expenseList.innerHTML = "";

    // Filter pencarian berdasarkan judul (case-insensitive)
    const filteredTransactions = transactions.filter((item) =>
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()),
    );

    filteredTransactions.forEach((transaction) => {
      const cardElement = createTransactionCard(transaction);
      if (transaction.type === "income") {
        if (incomeList) incomeList.appendChild(cardElement);
      } else {
        if (expenseList) expenseList.appendChild(cardElement);
      }
    });

    updateDashboard(transactions);
  }

  // 8. Event Handler Kirim Formulir (Tambah & Update Data)
  if (transactionForm) {
    transactionForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = titleInput.value.trim();
      const amount = Number(amountInput.value);
      const date = dateInput.value;
      const type = typeSelect.value;

      // Validasi Form (Kriteria Skilled 1): Judul Kosong atau Nominal < 1
      if (!title) {
        alert("Peringatan: Judul transaksi tidak boleh kosong!");
        titleInput.focus();
        return;
      }

      if (!amount || amount < 1) {
        alert(
          "Peringatan: Nominal uang harus diisi dan minimal bernilai 1 Rupiah!",
        );
        amountInput.focus();
        return;
      }

      const transactions = getTransactions();

      if (isEditing && currentEditId !== null) {
        // Proses Pembaruan Data (Mode Edit)
        const index = transactions.findIndex((t) => t.id === currentEditId);
        if (index !== -1) {
          transactions[index] = {
            ...transactions[index],
            title,
            amount,
            date,
            type,
          };
        }
        isEditing = false;
        currentEditId = null;

        const submitBtn = transactionForm.querySelector(
          'button[type="submit"]',
        );
        if (submitBtn) submitBtn.textContent = "Simpan";
      } else {
        // Proses Tambah Data Baru
        const newTransaction = {
          id: +new Date(), // ID unik otomatis
          title,
          amount,
          date,
          type,
        };
        transactions.push(newTransaction);
      }

      saveAndDispatch(transactions);
      transactionForm.reset();

      // Kembalikan tanggal form ke hari ini setelah reset
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }
    });
  }

  // 9. Handler Hapus Transaksi
  function handleDeleteTransaction(id) {
    let transactions = getTransactions();
    transactions = transactions.filter((t) => t.id !== id);
    saveAndDispatch(transactions);
  }

  // 10. Handler Ubah Tipe Transaksi (income <-> expense)
  function handleToggleType(id) {
    const transactions = getTransactions();
    const target = transactions.find((t) => t.id === id);
    if (target) {
      target.type = target.type === "income" ? "expense" : "income";
      saveAndDispatch(transactions);
    }
  }

  // 11. Handler Persiapan Edit (Mengisi Form otomatis)
  function handlePrepareEdit(transaction) {
    isEditing = true;
    currentEditId = transaction.id;

    if (titleInput) titleInput.value = transaction.title;
    if (amountInput) amountInput.value = transaction.amount;
    if (dateInput) dateInput.value = transaction.date;
    if (typeSelect) typeSelect.value = transaction.type;

    const submitBtn = transactionForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = "Perbarui";

    if (titleInput) titleInput.focus();
  }

  // 12. Fitur Pencarian Dinamis (Live Search & Reset Otomatis)
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value;
      renderApp(keyword);
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = searchInput ? searchInput.value : "";
      renderApp(keyword);
    });
  }

  // 13. Listener Custom Event untuk Sinkronisasi Tampilan Terpusat
  document.addEventListener("transaction:updated", () => {
    const currentKeyword = searchInput ? searchInput.value : "";
    renderApp(currentKeyword);
  });

  // Inisialisasi Pertama Kali Halaman Dimuat
  renderApp();
});
