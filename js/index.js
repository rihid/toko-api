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


// api.get('products/')
//     .then(res =>{
//         console.log(res.data.products)
//     })