const menuData = {
    'Espresso': 25000,
    'Cappuccino': 30000,
    'Latte': 35000,
    'Americano': 28000,
    'Mocha': 38000,
    'Caramel Macchiato': 40000,
    'Iced Coffee': 30000,
    'Cold Brew': 32000,
    'Hot Chocolate': 35000,
    'Green Tea Latte': 35000,
    'Sandwich': 35000,
    'Pasta': 45000,
    'French Fries': 20000,
    'Salad': 30000,
    'Cake': 35000
}

let tempOrderItems = []
let orderIdCounter = 1
let orders = []

function initializeMenu() {
    const menu = document.getElementById('menu')
    const menuList = document.getElementById('menuList')
    menu.innerHTML = ''
    menuList.innerHTML = ''
    for (const [item, price] of Object.entries(menuData)) {
        const menuCard = document.createElement('div')
        menuCard.className = 'menu-item'
        menuCard.innerHTML = `
            <h4>${item}</h4>
            <div class="price">Rp ${price.toLocaleString('id-ID')}</div>
        `
        menu.appendChild(menuCard)
        const option = document.createElement('option')
        option.value = item
        menuList.appendChild(option)
    }
}

function addItem() {
    const menuItem = document.getElementById('menuItem').value.trim()
    const quantity = parseInt(document.getElementById('menuQuantity').value)
    if (!menuItem) {
        alert('Silakan masukkan nama menu!')
        return
    }
    if (!menuData.hasOwnProperty(menuItem)) {
        alert('Menu tidak tersedia! Silakan pilih dari daftar menu.')
        return
    }
    if (isNaN(quantity) || quantity < 1) {
        alert('Jumlah minimal 1!')
        return
    }
    const existingItem = tempOrderItems.find(item => item.name === menuItem)
    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        tempOrderItems.push({
            name: menuItem,
            quantity: quantity,
            price: menuData[menuItem]
        })
    }
    updateOrderItemsDisplay()
    document.getElementById('menuItem').value = ''
    document.getElementById('menuQuantity').value = '1'
}

function updateOrderItemsDisplay() {
    const orderItemsDiv = document.getElementById('orderItems')
    if (tempOrderItems.length === 0) {
        orderItemsDiv.innerHTML = '<p style="text-align: center; color: #95a5a6;">Belum ada item ditambahkan</p>'
        return
    }
    orderItemsDiv.innerHTML = ''
    tempOrderItems.forEach((item, index) => {
        const itemDiv = document.createElement('div')
        itemDiv.className = 'order-item'
        itemDiv.innerHTML = `
            <span>${item.name} (${item.quantity}x)</span>
            <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
            <button type="button" class="btn btn-remove" onclick="removeItem(${index})">Hapus</button>
        `
        orderItemsDiv.appendChild(itemDiv)
    })
}

function removeItem(index) {
    tempOrderItems.splice(index, 1)
    updateOrderItemsDisplay()
}

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault()
    const customerName = document.getElementById('customerName').value.trim()
    if (!customerName) {
        alert('Silakan masukkan nama pemesan!')
        return
    }
    if (tempOrderItems.length === 0) {
        alert('Silakan tambahkan minimal 1 item pesanan!')
        return
    }
    const total = tempOrderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
    }, 0)
    const order = {
        id: orderIdCounter++,
        customerName: customerName,
        items: [...tempOrderItems],
        total: total,
        timestamp: new Date().toLocaleString('id-ID'),
    }
    orders.push(order)
    displayOrders()
    document.getElementById('orderForm').reset()
    tempOrderItems = []
    updateOrderItemsDisplay()
    alert(`Pesanan untuk ${customerName} berhasil ditambahkan!`)
})

function displayOrders() {
    const ordersList = document.getElementById('ordersList')
    ordersList.innerHTML = ''
    orders.forEach(order => {
        const receipt = createReceiptElement(order)
        ordersList.appendChild(receipt)
    })
}

function createReceiptElement(order) {
    const receiptDiv = document.createElement('div')
    receiptDiv.className = 'receipt'
    let itemsHTML = ''
    order.items.forEach(item => {
        const subtotal = item.price * item.quantity
        itemsHTML += `
            <div class="receipt-item">
                <span>${item.name} (${item.quantity}x)</span>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
        `
    })
    receiptDiv.innerHTML = `
        <div class="receipt-header">
            <h4>Pesanan #${order.id}</h4>
            <div class="timestamp">${order.timestamp}</div>
        </div>
        <div class="receipt-body">
            <p><strong>Nama:</strong> ${order.customerName}</p>
            <div class="receipt-items">
                ${itemsHTML}
            </div>
            <div class="receipt-total">
                Total: Rp ${order.total.toLocaleString('id-ID')}
            </div>
        </div>
    `
    return receiptDiv
}

window.addEventListener('load', function() {
    initializeMenu()
})