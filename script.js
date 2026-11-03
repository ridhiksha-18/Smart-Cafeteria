/* =====================================================
   SMART CAFETERIA
   DATA STRUCTURES PROJECT

   ARRAY  → stores all orders
   QUEUE  → pending orders FIFO
   STACK  → cancelled orders LIFO
===================================================== */


/* ================= FOOD DATA ================= */

const foodMenu = [
    {
        id: 1,
        name: "Burger",
        price: 120,
        emoji: "🍔",
        description: "Classic crispy chicken burger"
    },

    {
        id: 2,
        name: "Pizza",
        price: 180,
        emoji: "🍕",
        description: "Cheesy vegetable pizza"
    },

    {
        id: 3,
        name: "Sandwich",
        price: 100,
        emoji: "🥪",
        description: "Fresh grilled sandwich"
    },

    {
        id: 4,
        name: "Fried Rice",
        price: 150,
        emoji: "🍚",
        description: "Delicious vegetable fried rice"
    },

    {
        id: 5,
        name: "Coffee",
        price: 60,
        emoji: "☕",
        description: "Hot creamy coffee"
    },

    {
        id: 6,
        name: "Juice",
        price: 80,
        emoji: "🧃",
        description: "Fresh fruit juice"
    }
];


/* =====================================================
   ARRAY
   All orders are stored here.
===================================================== */

let orders =
    JSON.parse(localStorage.getItem("cafeteriaOrders")) || [];


/* =====================================================
   QUEUE
   Stores order IDs.
   FIFO → First In First Out
===================================================== */

let orderQueue =
    JSON.parse(localStorage.getItem("cafeteriaQueue")) || [];


/* =====================================================
   STACK
   Stores cancelled order IDs.
   LIFO → Last In First Out
===================================================== */

let cancelledStack =
    JSON.parse(localStorage.getItem("cafeteriaStack")) || [];


/* Selected food for current order */

let cart = [];


/* Next order ID */

let nextOrderId =
    Number(localStorage.getItem("nextOrderId")) || 1001;


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "cafeteriaOrders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "cafeteriaQueue",
        JSON.stringify(orderQueue)
    );

    localStorage.setItem(
        "cafeteriaStack",
        JSON.stringify(cancelledStack)
    );

    localStorage.setItem(
        "nextOrderId",
        nextOrderId
    );
}


/* =====================================================
   NAVIGATION
===================================================== */

const navItems =
    document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const sectionId =
            item.getAttribute("data-section");

        showSection(sectionId);

    });

});


function showSection(sectionId) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    document
        .getElementById(sectionId)
        .classList.add(
            "active-section"
        );


    navItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.getAttribute("data-section")
            === sectionId
        ) {
            item.classList.add("active");
        }

    });


    const titles = {

        dashboard: [
            "Dashboard",
            "Smart Cafeteria Order Management System"
        ],

        menu: [
            "Food Menu",
            "Choose your favourite food"
        ],

        orders: [
            "Order Queue",
            "FIFO — First In First Out"
        ],

        stack: [
            "Cancelled Stack",
            "LIFO — Last In First Out"
        ],

        search: [
            "Search Order",
            "Find orders stored in the array"
        ]

    };


    document.getElementById("pageTitle")
        .textContent = titles[sectionId][0];

    document.getElementById("pageSubtitle")
        .textContent = titles[sectionId][1];

    renderAll();

}


/* =====================================================
   RENDER MENU
===================================================== */

function renderMenu() {

    const menuGrid =
        document.getElementById("menuGrid");

    menuGrid.innerHTML = "";


    foodMenu.forEach(food => {

        const card =
            document.createElement("div");

        card.className = "food-card";


        card.innerHTML = `

            <div class="food-image">
                ${food.emoji}
            </div>

            <div class="food-info">

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-bottom">

                    <span class="price">
                        ₹${food.price}
                    </span>

                    <button
                        class="add-btn"
                        onclick="openOrderModal(${food.id})"
                    >
                        Add +
                    </button>

                </div>

            </div>

        `;


        menuGrid.appendChild(card);

    });

}


/* =====================================================
   MODAL FOOD MENU
===================================================== */

function renderModalFood() {

    const grid =
        document.getElementById(
            "modalFoodGrid"
        );

    grid.innerHTML = "";


    foodMenu.forEach(food => {

        const quantity =
            getCartQuantity(food.id);


        const item =
            document.createElement("div");

        item.className =
            "modal-food" +
            (quantity > 0
                ? " selected"
                : "");


        item.onclick =
            () => toggleFood(food.id);


        item.innerHTML = `

            <span class="food-emoji">
                ${food.emoji}
            </span>

            <div class="modal-food-info">

                <strong>
                    ${food.name}
                </strong>

                <span>
                    ₹${food.price}
                </span>

            </div>

            ${
                quantity > 0
                ? `<span class="quantity">
                    ${quantity}
                  </span>`
                : ""
            }

        `;


        grid.appendChild(item);

    });

}


/* =====================================================
   CART
===================================================== */

function getCartQuantity(foodId) {

    const item =
        cart.find(
            item => item.foodId === foodId
        );

    return item ? item.quantity : 0;
}


function toggleFood(foodId) {

    const existing =
        cart.find(
            item => item.foodId === foodId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            foodId: foodId,
            quantity: 1
        });

    }


    renderModalFood();

    updateCartSummary();

}


/* =====================================================
   OPEN ORDER MODAL
===================================================== */

function openOrderModal(foodId = null) {

    document
        .getElementById("orderModal")
        .classList.add("show");


    if (foodId) {

        const existing =
            cart.find(
                item => item.foodId === foodId
            );


        if (existing) {

            existing.quantity++;

        } else {

            cart.push({
                foodId: foodId,
                quantity: 1
            });

        }

    }


    renderModalFood();

    updateCartSummary();

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeOrderModal() {

    document
        .getElementById("orderModal")
        .classList.remove("show");

}


/* =====================================================
   CART SUMMARY
===================================================== */

function updateCartSummary() {

    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        const food =
            foodMenu.find(
                f => f.id === item.foodId
            );


        if (food) {

            totalItems += item.quantity;

            totalPrice +=
                food.price *
                item.quantity;

        }

    });


    document.getElementById("cartItems")
        .textContent = totalItems;


    document.getElementById("cartTotal")
        .textContent = `₹${totalPrice}`;

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    const customerName =
        document
            .getElementById("customerName")
            .value
            .trim();


    if (!customerName) {

        showToast(
            "Please enter customer name",
            "⚠️"
        );

        return;

    }


    if (cart.length === 0) {

        showToast(
            "Please select at least one food item",
            "⚠️"
        );

        return;

    }


    let items = [];

    let total = 0;


    cart.forEach(cartItem => {

        const food =
            foodMenu.find(
                f => f.id === cartItem.foodId
            );


        if (food) {

            items.push({

                name: food.name,

                quantity: cartItem.quantity,

                price: food.price

            });


            total +=
                food.price *
                cartItem.quantity;

        }

    });


    /* ===============================
       ARRAY INSERTION
    =============================== */

    const newOrder = {

        id: nextOrderId,

        customer: customerName,

        items: items,

        total: total,

        status: "Pending",

        createdAt:
            new Date().toLocaleString()

    };


    orders.push(newOrder);


    /* ===============================
       QUEUE ENQUEUE
    =============================== */

    orderQueue.push(nextOrderId);


    nextOrderId++;


    saveData();


    cart = [];


    document
        .getElementById("customerName")
        .value = "";


    closeOrderModal();


    showToast(
        `Order #${newOrder.id} placed successfully!`,
        "✓"
    );


    renderAll();

}


/* =====================================================
   PROCESS NEXT ORDER
   QUEUE DEQUEUE
===================================================== */

function processNextOrder() {

    if (orderQueue.length === 0) {

        showToast(
            "No pending orders!",
            "⚠️"
        );

        return;

    }


    /* FIFO */

    const orderId =
        orderQueue.shift();


    const order =
        orders.find(
            order => order.id === orderId
        );


    if (order) {

        order.status = "Served";

        order.servedAt =
            new Date().toLocaleString();

    }


    saveData();


    showToast(
        `Order #${orderId} served!`,
        "✓"
    );


    renderAll();

}


/* =====================================================
   CANCEL ORDER
===================================================== */

function cancelOrder(orderId) {

    const queueIndex =
        orderQueue.indexOf(orderId);


    if (queueIndex === -1) {

        return;

    }


    /* Remove from Queue */

    orderQueue.splice(
        queueIndex,
        1
    );


    const order =
        orders.find(
            order => order.id === orderId
        );


    if (order) {

        order.status =
            "Cancelled";

    }


    /* ===============================
       STACK PUSH
    =============================== */

    cancelledStack.push(orderId);


    saveData();


    showToast(
        `Order #${orderId} cancelled`,
        "✕"
    );


    renderAll();

}


/* =====================================================
   UNDO CANCELLATION
   STACK POP
===================================================== */

function undoCancellation() {

    if (cancelledStack.length === 0) {

        showToast(
            "No cancelled orders!",
            "⚠️"
        );

        return;

    }


    /* LIFO */

    const orderId =
        cancelledStack.pop();


    const order =
        orders.find(
            order => order.id === orderId
        );


    if (order) {

        order.status = "Pending";

    }


    /* Add back to Queue */

    orderQueue.push(orderId);


    saveData();


    showToast(
        `Order #${orderId} restored!`,
        "↶"
    );


    renderAll();

}


/* =====================================================
   CANCEL BUTTON
===================================================== */

function createCancelButton(orderId) {

    const button =
        document.createElement("button");


    button.textContent = "Cancel";


    button.style.border = "none";

    button.style.background =
        "#ffebeb";

    button.style.color =
        "#ef5350";

    button.style.padding =
        "6px 9px";

    button.style.borderRadius =
        "6px";

    button.style.cursor =
        "pointer";

    button.style.fontSize =
        "9px";


    button.onclick =
        () => cancelOrder(orderId);


    return button;

}


/* =====================================================
   GET ORDER
===================================================== */

function getOrder(orderId) {

    return orders.find(
        order => order.id === orderId
    );

}


/* =====================================================
   RENDER QUEUE
===================================================== */

function renderQueue() {

    const dashboardQueue =
        document.getElementById(
            "dashboardQueue"
        );


    const fullQueue =
        document.getElementById(
            "fullQueue"
        );


    dashboardQueue.innerHTML = "";

    fullQueue.innerHTML = "";


    if (orderQueue.length === 0) {

        dashboardQueue.innerHTML =
            `<div class="empty-state">
                No pending orders
             </div>`;


        fullQueue.innerHTML =
            `<div class="empty-state">
                Queue is empty
             </div>`;

    }


    orderQueue.forEach(
        (orderId, index) => {

            const order =
                getOrder(orderId);


            if (!order) return;


            /* Dashboard Queue */

            const card =
                document.createElement("div");


            card.className =
                "queue-card" +
                (index === 0
                    ? " front"
                    : "");


            card.innerHTML = `

                <small>
                    ${index === 0
                        ? "FRONT"
                        : "POSITION " + (index + 1)}
                </small>

                <strong>
                    #${order.id}
                </strong>

                <small>
                    ${order.customer}
                </small>

            `;


            dashboardQueue.appendChild(card);


            if (index <
                orderQueue.length - 1) {

                const arrow =
                    document.createElement("span");

                arrow.className =
                    "queue-arrow";

                arrow.textContent = "→";

                dashboardQueue.appendChild(
                    arrow
                );

            }


            /* Full Queue */

            const fullCard =
                document.createElement("div");


            fullCard.className =
                "queue-card" +
                (index === 0
                    ? " front"
                    : "");


            const itemsText =
                order.items
                    .map(
                        item =>
                        `${item.name} × ${item.quantity}`
                    )
                    .join(", ");


            fullCard.innerHTML = `

                <small>
                    ${
                        index === 0
                        ? "🚩 FRONT — PROCESS NEXT"
                        : "QUEUE POSITION " + (index + 1)
                    }
                </small>

                <strong>
                    #${order.id}
                </strong>

                <small>
                    Customer: ${order.customer}
                </small>

                <small>
                    ${itemsText}
                </small>

                <strong>
                    ₹${order.total}
                </strong>

            `;


            const cancelBtn =
                createCancelButton(order.id);


            fullCard.appendChild(
                cancelBtn
            );


            fullQueue.appendChild(
                fullCard
            );

        }
    );


    document.getElementById(
        "queueCount"
    ).textContent =
        orderQueue.length;

}


/* =====================================================
   RENDER STACK
===================================================== */

function renderStack() {

    const dashboardStack =
        document.getElementById(
            "dashboardStack"
        );


    const fullStack =
        document.getElementById(
            "fullStack"
        );


    dashboardStack.innerHTML = "";

    fullStack.innerHTML = "";


    if (cancelledStack.length === 0) {

        dashboardStack.innerHTML =
            `<div class="empty-state">
                No cancelled orders
             </div>`;


        fullStack.innerHTML =
            `<div class="empty-state">
                Stack is empty
             </div>`;

    }


    /* Stack is displayed from TOP */

    [...cancelledStack]
        .reverse()
        .forEach(
            (orderId, index) => {

                const order =
                    getOrder(orderId);


                if (!order) return;


                /* Dashboard */

                const card =
                    document.createElement("div");


                card.className =
                    "stack-card" +
                    (index === 0
                        ? " top"
                        : "");


                card.innerHTML = `

                    <span>
                        #${order.id}
                    </span>

                    <span>
                        ${order.customer}
                    </span>

                `;


                dashboardStack.appendChild(
                    card
                );


                /* Full stack */

                const fullCard =
                    document.createElement("div");


                fullCard.className =
                    "stack-card" +
                    (index === 0
                        ? " top"
                        : "");


                fullCard.innerHTML = `

                    <span>

                        ${
                            index === 0
                            ? "🔝 TOP"
                            : "POSITION " + (index + 1)
                        }

                    </span>

                    <span>
                        #${order.id}
                    </span>

                    <span>
                        ${order.customer}
                    </span>

                    <span>
                        ₹${order.total}
                    </span>

                `;


                fullStack.appendChild(
                    fullCard
                );

            }
        );


    document.getElementById(
        "stackCount"
    ).textContent =
        cancelledStack.length;

}


/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

function updateStats() {

    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
            order.status === "Pending"
        ).length;


    const served =
        orders.filter(
            order =>
            order.status === "Served"
        ).length;


    const cancelled =
        orders.filter(
            order =>
            order.status === "Cancelled"
        ).length;


    document.getElementById(
        "totalOrders"
    ).textContent = total;


    document.getElementById(
        "pendingOrders"
    ).textContent = pending;


    document.getElementById(
        "servedOrders"
    ).textContent = served;


    document.getElementById(
        "cancelledOrders"
    ).textContent = cancelled;

}


/* =====================================================
   SEARCH
===================================================== */

function searchOrder() {

    const input =
        document
            .getElementById("searchInput")
            .value
            .trim();


    const result =
        document.getElementById(
            "searchResult"
        );


    if (!input) {

        result.innerHTML = "";

        return;

    }


    const orderId =
        Number(input);


    /* ARRAY SEARCH */

    const order =
        orders.find(
            order =>
            order.id === orderId
        );


    if (!order) {

        result.innerHTML = `

            <div class="search-result-card">

                <strong>
                    ❌ Order not found
                </strong>

                <p style="
                    color:#73798a;
                    font-size:11px;
                    margin-top:6px;
                ">
                    No order with ID #${orderId}
                    exists in the order array.
                </p>

            </div>

        `;

        return;

    }


    const itemsText =
        order.items
            .map(
                item =>
                `${item.name} × ${item.quantity}`
            )
            .join(", ");


    result.innerHTML = `

        <div class="search-result-card">

            <span class="welcome-label">
                ORDER FOUND ✓
            </span>

            <h3 style="margin-top:5px;">
                Order #${order.id}
            </h3>

            <div class="result-grid">

                <div class="result-item">

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${order.customer}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Status
                    </span>

                    <strong>
                        ${order.status}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Items
                    </span>

                    <strong>
                        ${itemsText}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Total
                    </span>

                    <strong>
                        ₹${order.total}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Created
                    </span>

                    <strong>
                        ${order.createdAt}
                    </strong>

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message, icon = "✓") {

    const toast =
        document.getElementById("toast");


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    document.getElementById(
        "toastIcon"
    ).textContent = icon;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderAll() {

    renderMenu();

    renderModalFood();

    updateCartSummary();

    renderQueue();

    renderStack();

    updateStats();

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderAll();

    }
);


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

document
    .getElementById("orderModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeOrderModal();

            }

        }
    );