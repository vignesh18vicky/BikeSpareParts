const detailPrice = document.getElementById('detail-price');
let quantity = 1;
let pricePerUnit = 0;
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart');
    const cartItemCount = document.querySelector('#cart .number');
    const overlay = document.getElementById('overlay');
    const productDetail = document.getElementById('productDetail');
    const detailTitle = document.getElementById('detail-title');
    const detailImage = document.getElementById('detail-image');
    const detailDescription = document.getElementById('detail-description');
    const addToCartDetailButton = document.querySelector('.add-to-cart-detail');
    const checkoutPage = document.getElementById('checkoutPage');
    const checkoutItemsList = document.getElementById('checkoutItems');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    const quantitySpan = document.getElementById('qt');
    const searchInput = document.getElementById("searchInput");
    const cardContainer = document.querySelector('.card-container');

    let cart = [];
    let currentProductDetail = null;

    function updateCartIcon() {
        cartItemCount.textContent = cart.length;
        cartIcon.dataset.totalitems = cart.length;
    }
    function updateCheckoutDisplay() {
        checkoutItemsList.innerHTML = '';
        let total = 0;
    
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.alignItems = 'center';
            listItem.style.marginBottom = '10px';
    
            
            const itemInfo = document.createElement('span');
            itemInfo.textContent = `${item.name} - ₹ ${(item.price * item.quantity).toFixed(2)} (Qty: ${item.quantity})`;
    
            // add  buttons
            const actions = document.createElement('div');
            const addBtn = document.createElement('button');
            addBtn.textContent = '+';
            addBtn.className = 'addbtn';
            addBtn.onclick = () => {
                item.quantity++;
                updateCheckoutDisplay();
            };

            //minus buttons
            const subBtn = document.createElement('button');
            subBtn.textContent = '−';
            subBtn.className = 'minusbtn';
            subBtn.onclick = () => {
                if (item.quantity > 1) {
                    item.quantity--;
                }
                updateCheckoutDisplay();
            };
    
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '🗑';
            removeBtn.className = 'removebtn';
            removeBtn.onclick = () => {
                const removedItem = cart.splice(index, 1)[0];
                updateCheckoutDisplay();
                // Reset the "Add to cart" button
                const productCard = document.querySelector(`.product-card[data-id="${removedItem.id}"]`);
                if (productCard) {
                    const addToCartBtn = productCard.querySelector('.add-to-cart');
                    if (addToCartBtn) {
                        addToCartBtn.style.backgroundColor = '';
                        addToCartBtn.style.cursor = 'pointer';
                        addToCartBtn.textContent = 'Add to cart';
                        addToCartBtn.disabled = false;
                    }
                }
            };
    
            actions.appendChild(subBtn);
            actions.appendChild(addBtn);
            actions.appendChild(removeBtn);
    
            listItem.appendChild(itemInfo);
            listItem.appendChild(actions);
            checkoutItemsList.appendChild(listItem);
    
            total += item.price * item.quantity;
        });
    
        checkoutTotalElement.textContent = `Total: ₹ ${total.toFixed(2)}`;
        updateCartIcon();
    }
    

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (!existingItem) {
            cart.push({ ...product, quantity: product.quantity || 1 });
        } else {
            existingItem.quantity += product.quantity || 1;
        }
        // Change button color to gray for this product
        const productCard = document.querySelector(`.product-card[data-id="${product.id}"]`);
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.style.backgroundColor = '#757575';
            addToCartBtn.style.cursor = 'not-allowed';
            addToCartBtn.textContent = 'Added';
            addToCartBtn.disabled = true;
        }
        updateCartIcon();
        updateCheckoutDisplay();
    }

    function attachCardEventListeners() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const addToCartButton = card.querySelector('.add-to-cart');

            if (addToCartButton) {
                addToCartButton.addEventListener('click', function () {
                    const id = card.dataset.id;
                    const name = card.dataset.name;
                    const price = parseFloat(card.dataset.price);
                    const image = card.dataset.image;
                    const description = card.dataset.description;

                    detailTitle.textContent = name;
                    detailImage.src = image;
                    detailImage.alt = name;
                    detailDescription.textContent = description;
                    detailPrice.textContent = `₹ ${price.toFixed(2)}`;
                    // Set the pricePerUnit here
                    pricePerUnit = price;
                    quantity = 1;
                    quantitySpan.textContent = quantity;
                    currentProductDetail = { id, name, price };
                    overlay.style.display = 'block';
                    productDetail.style.display = 'block';
                });
            }
        });
    }

    if (addToCartDetailButton && productDetail) {
        addToCartDetailButton.addEventListener('click', function () {
            if (currentProductDetail) {
                addToCart({ ...currentProductDetail, quantity });
                closeDetail();
            }
        });
    }

    cartIcon.addEventListener('click', () => {
        overlay.style.display = 'block';
        checkoutPage.style.display = 'block';
        productDetail.style.display = 'none';
        updateCheckoutDisplay();
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            card.style.display = name.includes(query) ? 'block' : 'none';
        });
    });

    // Fetch product cards
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.dataset.id = product.id;
                card.dataset.name = product.name;
                card.dataset.price = product.price;
                card.dataset.image = product.image;
                card.dataset.description = product.description;

                card.innerHTML = `
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}" />
                    </div>
                    <div class="product-info">
                        <h3 class="pro-title">${product.name}</h3>
                        <p>${product.description.substring(0, 60)}...</p>
                        <div class="price-cart">
                            <span class="price">₹ ${product.price.toFixed(2)}</span>
                            <button class="btn add-to-cart">Add to cart</button>
                        </div>
                    </div>
                `;

                cardContainer.appendChild(card);
            });

            attachCardEventListeners();
        })
        .catch(err => console.error('Error loading products:', err));
});

function closeDetail() {
    document.getElementById('productDetail').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    currentProductDetail = null;
}

function closeCheckout() {
    document.getElementById('checkoutPage').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function updateDetailPrice() {
    const total = `₹ ${(pricePerUnit * quantity).toFixed(2)}`;
    detailPrice.textContent = total;
}

function increaseQuantity() {
    quantity++;
    document.getElementById('qt').textContent = quantity;
    updateDetailPrice();
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('qt').textContent = quantity;
        updateDetailPrice();
    }
}
