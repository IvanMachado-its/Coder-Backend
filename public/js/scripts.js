document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartContainer = document.getElementById('cart-container');
  
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
    }
  
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        cartContainer.classList.toggle('hidden');
      });
    }
  
    const loadProducts = async (page = 1, limit = 10, sort, query) => {
      const params = new URLSearchParams({ page, limit, sort, query });
      const response = await fetch(`/api/products?${params.toString()}`);
      const result = await response.json();
      const productsList = document.getElementById('products-list');
      productsList.innerHTML = '';
      result.payload.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>$${product.price}</p>
          <button data-id="${product._id}" class="add-to-cart-btn">Add to Cart</button>
        `;
        productsList.appendChild(productDiv);
      });
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = `
        ${result.hasPrevPage ? `<a href="#" data-page="${result.prevPage}">Prev</a>` : ''}
        <span>Page ${result.page} of ${result.totalPages}</span>
        ${result.hasNextPage ? `<a href="#" data-page="${result.nextPage}">Next</a>` : ''}
      `;
    };
  
    if (document.getElementById('products-list')) {
      loadProducts();
    }
  
    document.getElementById('pagination').addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        const page = e.target.getAttribute('data-page');
        loadProducts(page);
      }
    });
  
    const loadCart = async () => {
      const response = await fetch('/api/carts/your-cart-id'); // Replace with actual cart ID
      const cart = await response.json();
      const cartItems = document.getElementById('cart-items');
      cartItems.innerHTML = '';
      cart.products.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
          <h2>${item.product.name}</h2>
          <p>Quantity: ${item.quantity}</p>
          <button data-id="${item.product._id}" class="remove-from-cart-btn">Remove</button>
        `;
        cartItems.appendChild(itemDiv);
      });
    };
  
    if (document.getElementById('cart-items')) {
      loadCart();
    }
  
    document.getElementById('cart-items').addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-from-cart-btn')) {
        const productId = e.target.getAttribute('data-id');
        // Remove from cart logic here
      }
    });
  });
  