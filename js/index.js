// https://c00d-202-152-137-49.ap.ngrok.io

// Fetch APi
// Axios Config
const api = axios.create({
    baseURL: "https://dummyjson.com"
});

// Get
function getData(){
    return{
        prodDatas: [],
        fromApi(){
            return api.get('products/')
                .then(res => {
                    this.prodDatas = res.data.products
                })
        }
    }
}