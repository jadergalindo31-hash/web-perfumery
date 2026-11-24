
// Configuración: número internacional, solo dígitos.
// Usa un WhatsApp comercial autorizado.
const WHATSAPP_NUMBER = '573024902764';

// Catálogo y precios ficticios de demostración.
// Valida los datos con el negocio antes de publicar.
const products = [
  {
    id: 1,
    name: 'Sauvage Eau de Parfum',
    brand: 'Dior',
    gender: 'Masculino',
    price: 589000,
    tag: 'Amaderado',
    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    gender: 'Femenino',
    price: 679000,
    tag: 'Floral ámbar',
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    name: 'Eros Eau de Toilette',
    brand: 'Versace',
    gender: 'Masculino',
    price: 429000,
    tag: 'Fresco',
    img: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    name: 'Libre Eau de Parfum',
    brand: 'Yves Saint Laurent',
    gender: 'Femenino',
    price: 619000,
    tag: 'Floral',
    img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 5,
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    gender: 'Femenino',
    price: 559000,
    tag: 'Dulce',
    img: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    name: '1 Million',
    brand: 'Rabanne',
    gender: 'Masculino',
    price: 489000,
    tag: 'Especiado',
    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 7,
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    gender: 'Unisex',
    price: 1290000,
    tag: 'Ámbar',
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 8,
    name: 'CK One',
    brand: 'Calvin Klein',
    gender: 'Unisex',
    price: 299000,
    tag: 'Cítrico',
    img: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=80'
  }
];

// Formato de pesos colombianos
const money = n =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(n);

let cart = [];
let filter = 'Todos';

const $ = id => document.getElementById(id);

// Mostrar productos
function renderProducts() {
  let q = $('search').value.toLowerCase().trim();

  let list = products.filter(p =>
    (filter === 'Todos' || p.gender === filter) &&
    `${p.name} ${p.brand} ${p.tag}`.toLowerCase().includes(q)
  );

  $('products').innerHTML = list.length
    ? list.map(p => `
      <article class="product">
        <div class="photo">
          <img
            loading="lazy"
            src="${p.img}"
            alt="${p.name}"
            onerror="this.style.display='none'"
          >
        </div>

        <div class="info">
          <span class="tag">${p.tag}</span>
          <h3>${p.name}</h3>
          <div class="brand">${p.brand} · ${p.gender}</div>

          <div class="bottom">
            <b>${money(p.price)}</b>
            <button
              class="add"
              data-add="${p.id}"
              aria-label="Añadir ${p.name}"
            >+</button>
          </div>
        </div>
      </article>
    `).join('')
    : '<p class="empty">No encontramos resultados.</p>';
}

// Actualizar carrito
function renderCart() {
  $('count').textContent = cart.reduce((s, x) => s + x.qty, 0);

  $('items').innerHTML = cart.length
    ? cart.map(x => `
      <div class="cartrow">
        <div>
          <b>${x.name}</b><br>
          <small class="muted">${x.brand} · ${money(x.price)}</small>
        </div>

        <div class="qty">
          <button data-id="${x.id}" data-d="-1">−</button>
          ${x.qty}
          <button data-id="${x.id}" data-d="1">+</button>
        </div>
      </div>
    `).join('')
    : '<div class="empty">Tu bolsa espera su primera fragancia.</div>';

  $('subtotal').textContent = money(
    cart.reduce((s, x) => s + x.price * x.qty, 0)
  );
}

// Enlace para WhatsApp
function wa(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Abrir y cerrar carrito
function openCart() {
  $('drawer').classList.add('show');
  $('overlay').classList.add('show');
}

function closeCart() {
  $('drawer').classList.remove('show');
  $('overlay').classList.remove('show');
}

// Agregar productos
$('products').addEventListener('click', e => {
  let b = e.target.closest('[data-add]');
  if (!b) return;

  let p = products.find(x => x.id === +b.dataset.add);
  let old = cart.find(x => x.id === p.id);

  old ? old.qty++ : cart.push({ ...p, qty: 1 });

  renderCart();

  $('toast').classList.add('show');

  setTimeout(() => {
    $('toast').classList.remove('show');
  }, 1300);
});

// Cambiar cantidades del carrito
$('items').addEventListener('click', e => {
  let b = e.target.closest('[data-id]');
  if (!b) return;

  let x = cart.find(i => i.id === +b.dataset.id);

  x.qty += +b.dataset.d;

  if (x.qty < 1) {
    cart = cart.filter(i => i.id !== x.id);
  }

  renderCart();
});

// Filtros de categoría
document.querySelectorAll('.filter').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.filter').forEach(x =>
      x.classList.remove('active')
    );

    b.classList.add('active');
    filter = b.dataset.filter;

    renderProducts();
  };
});

// Buscador
$('search').oninput = renderProducts;

// Controles del carrito
$('openCart').onclick = openCart;
$('close').onclick = closeCart;
$('overlay').onclick = closeCart;

// Menú móvil
$('menu').onclick = () =>
  $('links').classList.toggle('open');

document.querySelectorAll('.links a').forEach(a => {
  a.onclick = () => $('links').classList.remove('open');
});

// WhatsApp de asesoría y contacto
$('advice').href = wa(
  'Hola, quisiera asesoría para elegir una fragancia.'
);

$('contactLink').href = wa(
  'Hola, quisiera información sobre sus perfumes.'
);

// Abrir formulario de pedido
$('checkout').onclick = () => {
  if (!cart.length) {
    $('toast').classList.add('show');

    setTimeout(() => {
      $('toast').classList.remove('show');
    }, 1200);

    return;
  }

  $('modal').classList.add('show');
};

$('closeModal').onclick = () =>
  $('modal').classList.remove('show');

// Enviar pedido a WhatsApp
$('form').onsubmit = e => {
  e.preventDefault();

  if (!cart.length) return;

  let lines = cart.map(x =>
    `• ${x.name} (${x.brand}) x${x.qty}: ${money(x.price * x.qty)}`
  ).join('\n');

  let total = cart.reduce(
    (s, x) => s + x.price * x.qty,
    0
  );

  let msg = `Hola, soy ${$('name').value.trim()}. Quisiera solicitar:

${lines}

Subtotal de referencia: ${money(total)}
Entrega: ${$('delivery').value}
Notas: ${$('notes').value.trim() || 'Ninguna'}

¿Me confirman disponibilidad, presentación, autenticidad, precio final y entrega?`;

  window.open(wa(msg), '_blank', 'noopener');

  $('modal').classList.remove('show');
  closeCart();
};

// Animaciones al desplazarse
const obs = new IntersectionObserver(entries => {
  entries.forEach(x => {
    if (x.isIntersecting) {
      x.target.classList.add('visible');
      obs.unobserve(x.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(x =>
  obs.observe(x)
);

// Carga inicial
renderProducts();
renderCart();
