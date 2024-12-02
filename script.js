let tables = [];
let activeTableId = null;
let currentDish = null;
let selectedExtra = null;
let dailySales = 0; // إجمالي مبيعات اليوم

// إنشاء الترابيزات بناءً على عدد الترابيزات المدخل
function createTables() {
  const numTables = parseInt(document.getElementById("num-tables").value, 10);
  const tablesContainer = document.getElementById("tables");
  tablesContainer.innerHTML = "";
  tables = [];

  for (let i = 1; i <= numTables; i++) {
    const table = {
      id: i,
      orders: []
    };
    tables.push(table);

    const tableDiv = document.createElement("div");
    tableDiv.classList.add("table");
    tableDiv.id = `table-${table.id}`;
    tableDiv.innerHTML = `<h3>ترابيزة ${table.id}</h3>
            <div id="orders-${table.id}"></div>
            <p id="total-${table.id}">الإجمالي: 0</p>
            <button onclick="endOrder(${table.id})">إنهاء الأوردر</button>`; // إضافة زر إنهاء الأوردر

    tableDiv.addEventListener("click", () => openMenu(table.id));
    tablesContainer.appendChild(tableDiv);
  }
}

// فتح نافذة القائمة عند الضغط على ترابيزة
function openMenu(tableId) {
  activeTableId = tableId;
  document.getElementById("menu-popup").classList.add("open"); // فتح نافذة القائمة باستخدام الـ class
}

// إغلاق نافذة القائمة
function closeMenu() {
  document.getElementById("menu-popup").classList.remove("open"); // إغلاق نافذة القائمة باستخدام الـ class
}

// اختيار إضافة (مثل المكرونة أو الكشري) من القائمة
function chooseExtraOption(dishName, price) {
  currentDish = { name: dishName, price: price };
  closeMenu();
  document.getElementById("extra-option-popup").classList.add("open");
}

// إغلاق نافذة اختيار الإضافات
function closeExtraOptionPopup() {
  document.getElementById("extra-option-popup").classList.remove("open");
}

// اختيار نوع المكرونة بعد تحديد الإضافة
function selectPastaType(extra) {
  selectedExtra = extra;
  closeExtraOptionPopup();

  if (selectedExtra === "بدون") {
    currentDish.price = currentDish.price;
  } else {
    currentDish.price += 20; // إضافة سعر الإضافة
  }

  document.getElementById("pasta-type-popup").classList.add("open");
}

// إغلاق نافذة اختيار نوع المكرونة
function closePastaTypePopup() {
  document.getElementById("pasta-type-popup").classList.remove("open");
}

// إضافة طلب مكرونة مع نوعها
function addPastaOrder(pastaType) {
  if (activeTableId !== null && currentDish !== null && selectedExtra !== null) {
    const table = tables.find((t) => t.id === activeTableId);
    if (table) {
      const orderName = selectedExtra === "بدون"
        ? `${currentDish.name} (${pastaType})`
        : `${currentDish.name} + ${selectedExtra} (${pastaType})`;

      const finalPrice = currentDish.price;
      table.orders.push({ name: orderName, price: finalPrice });
      displayOrders(table);
    }
  }

  // إعادة تعيين المتغيرات بعد إتمام الطلب
  currentDish = null;
  selectedExtra = null;
  closePastaTypePopup();
}

// إضافة طلب إلى الترابيزة
function addOrderToActiveTable(name, price) {
  if (activeTableId !== null) {
    const table = tables.find((t) => t.id === activeTableId);
    if (table) {
      table.orders.push({ name, price });
      displayOrders(table);
    }
  } else {
    alert("لم يتم اختيار ترابيزة.");
  }
  closeMenu();
}

// عرض الطلبات والإجمالي في الترابيزة
function displayOrders(table) {
  const ordersDiv = document.getElementById("orders-" + table.id);
  ordersDiv.innerHTML = "";
  let total = 0;

  table.orders.forEach((order, index) => {
    total += order.price;
    const orderDiv = document.createElement("div");
    orderDiv.innerHTML = `${order.name} - ${order.price} <button onclick="removeOrder(${table.id}, ${index})">حذف</button>`;
    ordersDiv.appendChild(orderDiv);
  });

  document.getElementById("total-" + table.id).textContent = "الإجمالي: " + total;
}

// إزالة طلب من الترابيزة
function removeOrder(tableId, orderIndex) {
  const table = tables.find((t) => t.id === tableId);
  if (table) {
    table.orders.splice(orderIndex, 1);
    displayOrders(table);
  }
}

// إنهاء الأوردر ونقل الإجمالي إلى مبيعات اليوم
function endOrder(tableId) {
  const table = tables.find((t) => t.id === tableId);
  if (table) {
    const total = table.orders.reduce((sum, order) => sum + order.price, 0);
    dailySales += total; // إضافة المجموع إلى إجمالي مبيعات اليوم
    document.getElementById("total-sales").textContent = dailySales; // تحديث إجمالي مبيعات اليوم
    table.orders = []; // تصفير الأوامر في الترابيزة
    displayOrders(table); // تحديث عرض الأوامر للترابيزة
    document.getElementById("total-" + table.id).textContent = "الإجمالي: 0"; // تصفير الإجمالي في الترابيزة
  }
}

// إعادة ضبط إجمالي مبيعات اليوم
function resetDailySales() {
  dailySales = 0;
  document.getElementById("total-sales").textContent = dailySales; // إعادة تعيين إجمالي المبيعات إلى صفر
}
