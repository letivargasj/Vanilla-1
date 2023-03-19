console.log('Conectado!!')
let carrito = {}
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

//Manda llamar la base de datos con la funcion cargaDatosDB
document.addEventListener('DOMContentLoaded', e => {
    cargaDatosBD()
    //Para que no se elimine cada que se refresca la pagina
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

//Manda llamar a carrito al hacerle click en la carta
cards.addEventListener('click', e => {
    //console.log('e', e)
    addCarrito(e)
 })

items.addEventListener('click', e => {
    btnAcciones(e)
})

const btnAcciones = e => {
    if(e.target.classList.contains('btn-success')) {
        let producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        let producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0){
            delete carrito [e.target.dataset.id]
        }else{
            carrito[e.target.dataset.id] = { ...producto }
        }
        pintarCarrito()
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito))
    e.stopPropagation()
}

 //se agrega al carrito diciendo que si presiona el boton dark
 const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }
    e.stopPropagation()
}

//Se guarda el producto en un contenido para cada carrito
const setCarrito = item => {
    const producto = {
        id: item.querySelector('button').dataset.id,
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        cantidad: 1
    }
    //A la cantidad carrito se le agrego uno, si es que ya existe uno
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    
    carrito[producto.id] = { ...producto }
    //console.log('producto', producto, carrito)
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        //agregamos Id a los botones
        templateCarrito.querySelector('.btn-success').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = 
        `
        <th scope="row" colspan="5">
            Carrito Vacio- Compra YA!
        </th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => 
        acc + cantidad
    , 0)

    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => 
        acc + (cantidad * precio)
    , 0)
    //console.log(nCantidad, nPrecio)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        localStorage.setItem('carrito', JSON.stringify(carrito))
        pintarCarrito()
    })
}


//La función manda llamar todos los datos del archivo de api.json
// ademas manda llamar la funcion pintarCards
const cargaDatosBD = async () => {
    const res = await fetch('../db/api.json')
    const data = await res.json()
    pintarCards(data)
}

//Se muestran todos los items de productos de la base, se agrega los 4 contenidos de cada uno
const pintarCards = (data) => {
    data.forEach(item => {
        console.log(item)
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute("src", item.imageUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    
    cards.appendChild(fragment)
}

