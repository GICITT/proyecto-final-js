const consultarProductos = async () => {
	const response = await fetch("./base/productos.json");
	const productos = await response.json();
	return productos;
};

const productos = consultarProductos();

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productosContainer = document.querySelector("#productos__container");
const listaCarrito = document.querySelector(".listaCarrito");
const countCarrito = document.querySelector(".countCarrito");
const btnFinalizar = document.querySelector("#btn-finalizar");

consultarProductos().then((productos) => {
	productos.forEach((producto) => {
		productosContainer.innerHTML += `<div class="card">
        <h3>${producto.nombre}</h3>
        <div class="imagen">
            <img src=${producto.imagen} alt="" />
        </div>
        <p class="precio">$${producto.precio}</p>
        <a href="#" class="btn-comprar" id='${producto.id}'>Comprar</a>
    </div>`;
	});
	btnComprar(productos);
});

function btnComprar(productos) {
	const btnAgregar = document.querySelectorAll(".btn-comprar");

	btnAgregar.forEach((btn) => {
		btn.onclick = (e) => {
			e.preventDefault();
			const productoSeleccionado = productos.find(
				(prod) => prod.id === parseInt(btn.id)
			);
			const productoCarrito = { ...productoSeleccionado, cantidad: 1 };
			const indexCarrito = carrito.findIndex(
				(prod) => prod.id === productoCarrito.id
			);
			if (indexCarrito === -1) {
				carrito.push(productoCarrito);
			} else {
				carrito[indexCarrito].cantidad++;
			}
			localStorage.setItem("carrito", JSON.stringify(carrito));
			actualizarCarrito();
			imprimirCarrito();
		};
	});
}

function imprimirCarrito() {
	listaCarrito.innerHTML = "";
	carrito.forEach((item) => {
		listaCarrito.innerHTML += `<li><div><img src="${item.imagen}" /> ${
			item.nombre
		} x ${item.cantidad}</div> <div>$${
			item.cantidad * item.precio
		}<i class='bx bxs-trash' data-id='${item.id}'></i></div></li>`;
	});
	if (carrito !== []) {
		const btnEliminar = document.querySelectorAll(".bxs-trash");
		btnEliminar.forEach((btn) => {
			btn.onclick = (e) => {
				const productoId = e.target.getAttribute("data-id");
				carrito = carrito.filter((prod) => prod.id != productoId);
				localStorage.setItem("carrito", JSON.stringify(carrito));
				actualizarCarrito();
				imprimirCarrito();
			};
		});
	}
	crearTotal();
}

function actualizarCarrito() {
	countCarrito.innerHTML = carrito.length;
}

function crearTotal() {
	sumatotal = 0;
	carrito.forEach((producto) => {
		sumatotal += producto.precio * producto.cantidad;
	});
	const total = document.querySelector("#total");

	sumatotal !== 0 ? carritoLleno() : carritoVacio();
}

function carritoLleno() {
	total.innerHTML = `<span>El total es de $${sumatotal}</span>`;
	btnFinalizar.style.display = "block";
}

function carritoVacio() {
	total.innerHTML = `El carrito esta vacio`;
	btnFinalizar.style.display = "none";
}

function finalizarCompra() {
	swal(
		"Compra realizada con exito",
		"Recibirá los datos de la compra por mail",
		"success"
	);
	carrito = [];
	localStorage.setItem("carrito", JSON.stringify(carrito));
	actualizarCarrito();
	imprimirCarrito();
	carritoVacio();
}

btnFinalizar.addEventListener("click", finalizarCompra);

imprimirCarrito();
actualizarCarrito();
crearTotal();
