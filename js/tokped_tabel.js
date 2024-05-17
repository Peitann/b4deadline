fetch("tokopedia/laptop_gaming_tokopedia.json")

.then(function(response){
    return response.json();
})

.then(function(products){
    let placeholder = document.querySelector("#data-output");
    let out ="";
    for(let product of products){
        out += `
        <tr>
            <td>${product.nama}</td>
            <td>${product.harga}</td>
            <td>${product.lokasi}</td>
            <td>${product.toko}</td>
            <td>${product.rating}</td>
            <td>${product.terjual}</td>
        </tr>
        `;
    }

    placeholder.innerHTML = out;
})