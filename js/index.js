// Dummy JSON Endpoint: https://dummyjson.com
// Dari Backend Endpoint: http://127.0.0.1:8080

// Fetch APi
// Axios Config
const api = axios.create({
    baseURL: "http://127.0.0.1:8080"
});

// Get all data
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
function getDetail(){
    return{
        detailData: [],
        apiGet(id){
            return api.get(`product/${id}`)
                .then(res => {
                    this.detailData = res.data.data;
                    // console.log(profileDt)
                })
        }
    }
}

// Get Profile

function getProfile(){
        return{
            profileDt: [],
            apiGet(){
                return api.get('costumer/1')
                    .then(res => {
                        this.profileDt = res.data.data;
                        // console.log(profileDt)
                    })
            }
        }
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