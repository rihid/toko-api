// Dari Backend Endpoint: http://127.0.0.1:8080
// Dummy JSON Endpoint: https://dummyjson.com

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

// Detail
function detailProd(product){
    location.href = `#product-${product.ID}`;
   $('#detail').attr('x-show', `page === '#product-${product.ID}'`);
   $('#detail').append(`
    <div class="single-product mt-150 mb-150">
            <div class="container">
                <div class="row">
                    <div class="col-md-5">
                        <div class="single-product-img">
                            <img src="" alt="Gambar Produk">
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="single-product-content">
                            <h3>${product.name}</h3>
                            <p class="single-product-pricing">${product.price}</p>
                            <p>${product.description}</p>
                            <div class="single-product-form">
                                <form action="post" for="select" class="d-none">
                                    <input type="number" placeholder="0" id="select" value="1">
                                </form>
                                <button class="cart-btn btn btn-success mt-2 mb-3" type="button" id="add-button" value="{{product.id}}"><i class="fas fa-shopping-cart"></i> Keranjang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   `)
    
}


// api.get('products/')
//     .then(res =>{
//         console.log(res.data.products)
//     })