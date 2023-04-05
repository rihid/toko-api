// Dummy JSON Endpoint: https://dummyjson.com
// Dari Backend Endpoint: http://127.0.0.1:8080

// Fetch APi
// Axios Config
const api = axios.create({
    baseURL: "http://127.0.0.1:8080"
});

// Get
function getData(){
    return{
        prodDatas: [],
        fromApi(){
            return api.get('product/')
                .then(res => {
                    this.prodDatas = res.data.data;
                })
        }
    }
}

// Detail ke halaman ./single.html

let prodId = new URLSearchParams(location.search).get('id')
function getDetail(id){
    return api.get(`product/${id}`)
        .then(res =>{
            $('#title').text(res.data.data.name)
            $('#price').text(res.data.data.price)
            $('#desc').text(res.data.data.description)
            // return res.data.data
            // console.log(res.data.data)
        })
}



/*
function detailProd(product){
    location.href = `#product-${product.ID}`;
   $('#detail').attr('x-show', `page === '#product-${product.ID}'`);
   $('#prod-name').text(`${product.name}`)
   $('#price').text(`${product.price}`)
   $('#desc').text(`${product.description}`)

   $('#cart-btn').on('click', function(evt){
    evt.preventDefault()
    console.log(evt)
   })
    
}
*/


// api.get('products/')
//     .then(res =>{
//         console.log(res.data.products)
//     })