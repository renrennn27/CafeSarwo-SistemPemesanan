const { createElement } = require("react")

const menuData = {
            'Espresso': 25000,
            'Cappuccino': 30000,
            'Latte': 35000,
            'Americano': 28000,
            'Milk Tea': 30000,
            'Mocha': 38000,
            'Caramel Macchiato': 40000,
            'Iced Coffee': 30000,
            'Cold Brew': 32000,
            'Frappuccino': 45000,
            'Hot Chocolate': 35000,
            'Green Tea Latte': 35000,
            'Thai Tea': 28000,
            'Croissant': 25000,
            'Sandwich': 35000,
            'Pasta': 45000,
            'Pizza Slice': 40000,
            'Burger': 50000,
            'French Fries': 20000,
            'Salad': 30000,
            'Cake': 35000
        }

let tempOrderItems = []
let orders = []
let orderIdCounter = 1

function initiaLizeMenu () {
    const menu = document.getElementById('menu')
    const MenuList = document.getElementById('menuList')

    menu.innerHTML = ''
    MenuList.innerHTML = ''

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
        MenuList.appendChild(option)
    }
}

function addItem() {
    const menuItem = document.getElementById('menuItem').value.trim()
    const quantity = parseInt(document.getElementById('menuQuantity').value)

    if (!menuItem) {
        alert('Silahkan masukkan menu! ')
        return
    }

    if (!menuData.hasOwnProperty(menuItem)) {
        alert('Menu tidak tersedia! Silakan pilih dari daftar menu.')
        return
    }

    if (quantity < 1) {
        alert('Jumlah minimal 1! ')
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
    
    updateOrderItemDisplay();
    document.getElementById('menuItem').value = ''
    document.getElementById('menuQuantity').value = '1'
}

function updateOrderItemDisplay() {
    const orderItems = document.getElementById('orderItems')

    if (tempOrderItems.length === 0) {
        orderItems.innerHTML = '<p style="color: #95a5a6;">Belum ada item ditambahkan</p>'
        return
    }

    orderItems.innerHTML = ''
    tempOrderItems.forEach((item, index) => {
        const itemDiv = document.createElement('div')
        itemDiv.className = 'order-item'
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>${item.quantity}x</span>
            <button type="button" class="btn btn-remove" onclick="removeItem(${index})">Hapus</button>
        `
        orderItems.appendChild(itemDiv)
    })
}

function removeItem(index) {
    tempOrderItems.splice(index, 1);
    updateOrderItemDisplay();
}

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault()

    const customerName = document.getElementById('customerName').value.trim()

    if (!customerName) {
        alert('Silahkan masukkan nama pemesan! ')
        return
    }

    if (tempOrderItems.length === 0) {
        alert('Silahkan tambahkan menu pesanan minimal 1 item sebelum kirim pesanan! ')
        return
    }

    const total = tempOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const order = {
        id: orderIdCounter++,
        customerName: customerName,
        items: [...tempOrderItems],
        total: total,
        timestamp: new Date().toLocaleString('id-ID')
    }
   
    orders.push(order)
    displayOrders()

    document.getElementById('orderForm').reset()
    tempOrderItems = []
    updateOrderItemDisplay()

    alert(`Pesanan untuk ${customerName} berhasil ditambahkan!`)
})

function displayOrders() {
    const orderList = document.createElement('div')
    dispatchEvent.className = 'receipt'

    let itemHTML = ''
    orders.items.forEach(order => {
        orderList.appendChild(createReceiptElement(order))
    })
}


window.addEventListener('load', function() {
    initiaLizeMenu()
})