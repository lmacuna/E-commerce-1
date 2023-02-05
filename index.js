var cerrar = false;
const getData = async () => {


    var res = await fetch('http://localhost:5500/mock/data.json', {
        method: 'GET'
    })

    var result = await res.json()
    result = result.data
    return (console.log(result), vistaEcom(result), localStorage.setItem("imagenes", JSON.stringify(result)))
}



getData()


const vistaEcom = (result) => {

    result.forEach(e => {
        document.querySelector("#root").innerHTML += `
        <tr class="escala" style=" transition: all 0.5s;width:18%;display:inline-block;height:220px;border:1px solid grey;font-size:12px;background:darkslategrey;color:white;padding:10px;margin:15px">
        <td style="display:block"><img style="width:100%;height:120px " src=${e.img} alt="imagen"></img></td>
        <td  style="display:block;margin-top:20px !important">COD.${e.id}</td>
        <td  style="display:block">${e.art}</td>
        <td  style="display:block;font-weight:bold">ARS $${e.precio}</td>
       
        <td style="width:100% !important;display:block"><button style="width:100%;height:30px" id=${e.id} onclick="agregarCarro(id)">Add</button></td>
        </tr>
        `
    });

}

var carro = []

function agregarCarro(id) {

    cerrar = true
    var id = parseInt(id)
    console.log(id)
    Swal.fire({
        text: 'Agregar al carrito?',
        width: '300px',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sí, Agregar',
        denyButtonText: `No Agregar`,
        showCancelButton: false,
        //showConfirmButton: false,
    }).then((result) => {
        if (result.isConfirmed) {

            var imagenes = localStorage.getItem("imagenes")
            imagenes = JSON.parse(imagenes)
            var re = imagenes.find(r => r.id === id)
            var cant = 1;

            var resp = carro.find(r => r.id === id)
            if (carro.length !== 0 && resp) {

                console.log(resp)
                if (resp) {
                    resp.cantidad++
                    re = imagenes.find(r => r.id === id)
                    resp.monto = re.precio;
                    (resp.monto = resp.monto * resp.cantidad)
                    console.log(carro)

                } else if (resp) {
                    var objetoCarro = {
                        id: re.id,
                        imagen: re.img,
                        desc: re.art,
                        monto: re.precio,
                        cantidad: cant
                    }
                    carro.push(objetoCarro)
                    console.log(carro)
                }

                setTimeout(() => {
                    window.location.href = "#header"
                }, 500)
            } else {
                var objetoCarro = {
                    id: re.id,
                    imagen: re.img,
                    desc: re.art,
                    monto: re.precio,
                    cantidad: cant
                }
                carro.push(objetoCarro)
                console.log(carro)
                setTimeout(() => {
                    window.location.href = "#header"
                }, 500)
            }
            return (console.log(carro), vistaCarro(carro), localStorage.setItem("carro", JSON.stringify(carro)));
        } else if (result.isDenied) {
            Swal.fire({
                text: 'Cancelado',
                width: '200px',
                timer: 3000,
                showCancelButton: false,
                showConfirmButton: false,
            })
            
        }

    })


}



const vistaCarro = (carro) => {

    if (carro.length !== 0) {
        var total = 0;

        document.querySelector("#carro").innerHTML = ""

        document.querySelector("#table").classList.add("table-2-on")
        carro.forEach(c => (


            document.querySelector("#carro").innerHTML += `<tr>
        <td>${c.id}</td>
        <td>${c.desc}</td>
        <td>${c.cantidad}</td>
        <td>$${c.monto}</td>
        <td style="width:40px !important"><button class="btn-add" onclick="agregarCarro(id)" id=${c.id}>+</button></td>
        <td style="width:40px !important"><button class="btn-rest" onclick="restarCarro(id)" id=${c.id}>-</button></td>
        </tr>
        `

        ))

        for (let i = 0; i < carro.length; i++) {
            total = total + carro[i].monto
            localStorage.setItem("total", JSON.stringify(total))

        }
        document.querySelector("#total").innerHTML = ""
        document.querySelector("#total").innerHTML = `<div style="width:159px;border-radius:11px;height:30px;background:rgb(121, 235, 216);color:black;display:flex;justify-content:center;align-items:center;flex-direction:row">$${total}</div>`
    } else {
        document.querySelector("#carro").innerHTML = ""
    }
}



const vaciarCarro = () => {


    if (cerrar === true) {
        carro = localStorage.getItem("carro")
        carro = JSON.parse(carro)
        Swal.fire({
            text: 'Vaciar carro?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar',
            denyButtonText: `No vaciar`,
            showCancelButton: false,
            width: '300px'
            //showConfirmButton: false,
        }).then((result) => {
            if (result.isConfirmed) {
                document.querySelector("#carro").innerHTML = ""
                total = 0
                document.querySelector("#total").innerHTML = ""
                document.querySelector("#total").innerText = `$${total}`
                document.querySelector("#table").classList.remove("table-2-on")
                localStorage.removeItem("carro")
                localStorage.removeItem("total")
                carro.length = 0
                Swal.fire({
                    text: 'CARRO VACIO',
                    timer: 3000,
                    width: '200px',
                    showCancelButton: false,
                    showConfirmButton: false,

                })

                cerrar = false
            } else if (result.isDenied) {
                Swal.fire({
                    text: 'CARRO SUCCESS',
                    timer: 3000,
                    width: '200px',
                    showCancelButton: false,
                    showConfirmButton: false,

                })
            }
        })
    } else if (cerrar === false) {
        Swal.fire({
            text: 'EL CARRO YA ESTÁ VACIO',
            timer: 3000,
            width: '200px',
            showCancelButton: false,
            showConfirmButton: false,

        })

        document.querySelector("#carro").innerHTML = ""
        //getData()
    }


}


const restarCarro = (id) => {
    console.log(id)
    id = parseInt(id)
    let imagenes = localStorage.getItem("imagenes")
    imagenes = JSON.parse(imagenes)
    carro = localStorage.getItem("carro")
    carro = JSON.parse(carro)

    var m = imagenes.find(m1 => m1.id === id)

    var e = carro.find(c => c.id === id)

    let index = carro.indexOf(e)
    console.log(index)
    console.log(e)
    e.cantidad = e.cantidad - 1
    let objetoCarro = {
        id: m.id,
        desc: m.art,
        imagen: m.img,
        cantidad: e.cantidad,
        monto: e.monto - m.precio
    }

    carro = carro.filter(c => c.id != id)


    carro.splice(index, 0, objetoCarro)
    localStorage.setItem("carro", JSON.stringify(carro))
    carro = localStorage.getItem("carro")
    carro = JSON.parse(carro)
    vistaCarro(carro)



    for (let i = 0; i < carro.length; i++) {

        if (carro[i].cantidad === 0) {
            carro = carro.filter(ca => ca.cantidad !== 0)
            if (carro.length !== 0) {

                console.log(carro)


                localStorage.setItem("carro", JSON.stringify(carro))
                carro = localStorage.getItem("carro")
                carro = JSON.parse(carro)
                vistaCarro(carro)
            } else if (carro.length === 0) {
                //vaciarCarro()
                limpiar()
            }

        }
    }






}

const limpiar = () => {
    document.querySelector("#carro").innerHTML = ""
    total = 0
    document.querySelector("#total").innerHTML = ""
    document.querySelector("#total").innerText = `$${total}`
    document.querySelector("#table").classList.remove("table-2-on")
    localStorage.removeItem("carro")
    localStorage.removeItem("total")
    carro.length = 0
    Swal.fire({
        text: 'CARRO VACIO',
        timer: 3000,
        width: '200px',
        showCancelButton: false,
        showConfirmButton: false,

    })

    cerrar = false
}

//EJEMPLO Stackoverflow filtrar el que no queremos y filter genera
// un nuevo array con los elementos existentes menos el filtrado en el caso de no necesitarlo

/* const resultado = animales.filter(animal => animal != 'oso');
console.log(resultado); */