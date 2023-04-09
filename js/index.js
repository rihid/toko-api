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

// Edit data diri
function updateData(id){
    const form = document.querySelector('#update-form');
    let formData = new FormData(form)
    
    api.put(`costumer/${id}`, formData)
    .then(res => {
        console.log(res)
    })
    .catch(err => err);
    
}


// Get Transaction
function getTransaction(){
    return{
        transactionDt: [],
        totalDt: 0,
        cartnum: 0,
        apiGet(){
            return api.get('transaksion/')
                .then(res => {
                    this.transactionDt = res.data.data;
                    this.cartnum = res.data.data.length;
                    console.log(res.data.data.length)
                })
        },
        getTotal(){
            return api.get('transaksion/')
                .then(res => {
                    res.data.data.forEach( arr => {
                        this.totalDt += arr.Product.price;
                    })
                })
        }
    }
}
// Post Transaction
function postTr(id){
    return api.post('transaksion/', {
        product_id: id,
        costumer_id: 1,
        total: 0,
    })
        .then( res => {
            // $('#info-alert').css('display', 'block')
            console.log(res.data.data.product_id)
        })
}

// Delete Cart
function delProd(id){
    return api.delete(`transaksion/${id}`)
        .then(res => {
            location.reload();
            console.log(res)
        })
    // console.log(id)
}

// var obj = { a: 'test1', b: 'test2' };
// if (Object.values(obj).indexOf('test1') > -1) {
//    console.log('has test1');
// }

// Register Post Data
const form = document.querySelector('#post-form')
form.addEventListener('submit', function(e){
    e.preventDefault();
    let formData = new FormData(form)

    api.post('costumer/', formData)
    .then(res => {
        if(res.status == 200){
            document.querySelector('#success-info').style = "block";
            // location.href = "./index.html";
        }else{
            document.querySelector('#failed-info').style = "block";
        }
        console.log(res)
    })
    .catch(err => err);
        
});



