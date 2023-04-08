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

// Get Transaction
function getTransaction(){
    return{
        transactionDt: [],
        totalDt: 0,
        apiGet(){
            return api.get('transaksion/')
                .then(res => {
                    this.transactionDt = res.data.data;
                    // console.log(res.data.data)
                })
        },
        getTotal(){
            return api.get('transaksion/')
                .then(res => {
                    console.log(res.data.data)
                    
                    res.data.data.forEach( arr => {
                        this.totalDt += arr.Product.price;
                    })
                })
        }
    }
}


