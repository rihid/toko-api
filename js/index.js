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
console.log(prodId)
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
                return api.get('costumer/2')
                    .then(res => {
                        this.profileDt = res.data.data;
                        // console.log(profileDt)
                    })
            }
        }
}

// Edit data diri

function dataEdit(data){
    // Menambahkan atribut value
    $('#name-edit').attr('value', `${data.costumer_name}`)
    $('#phone-edit').attr('value', `${data.phone_number}`)
    $('#address-edit').text(`${data.address}`)

    // Mendapatkan data object awal
    let nameEdit = `${data.costumer_name}`;
    let phoneEdit = `${data.phone_number}`;
    let addrEdit = `${data.address}`;

    // perubahan onkeyup
    $('#name-edit').on('keyup', function(evt){
        nameEdit = evt.target.value;
        // console.log(nameEdit)
    })

    $('#phone-edit').on('keyup', function(evt){
        phoneEdit = evt.target.value;
        // console.log(phoneEdit)
        
    })

    $('#address-edit').on('keyup', function(evt){
        addrEdit = evt.target.value;
        // console.log(addrEdit)
    })

    $('#update-form').on('submit', evt => {
        evt.preventDefault();
        let editObj = {
            costumer_name: nameEdit,
            phone_number: phoneEdit,
            address: addrEdit,
        }
        // console.log(editObj)

        api.put(`costumer/${data.ID}`, editObj)
        .then(res => {
            console.log(res)
            location.reload()
        })
        .catch(err => err);

    })
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
            location.reload()
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






// Register Post Data

/*
const form = document.querySelector('#post-form')
form.addEventListener('submit', function(e){
    e.preventDefault();
    let formData = new FormData(form)

    api.post('costumer/', formData)
    .then(res => {
        if(res.status == 200){
            document.querySelector('#success-info').style = "block";
        }else{
            document.querySelector('#failed-info').style = "block";
        }
        console.log(res)
    })
    .catch(err => err);
        
});
*/

// Post Data Register

let nameReg = '';
let phoneReg = '';
let addrReg = '';
// let formObj = {};

$('#name').on('keyup', function(evt){
    nameReg = evt.target.value;
})

$('#phone').on('keyup', function(evt){
    phoneReg = evt.target.value;
})

$('#address').on('keyup', function(evt){
    addrReg = evt.target.value;
})

$('#post-form').on('submit', evt =>{
    evt.preventDefault();
    let formObj = {
        costumer_name: nameReg,
        phone_number: phoneReg,
        address: addrReg,
    }

    api.post('costumer/', formObj)
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

})


