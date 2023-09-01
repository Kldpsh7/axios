//AXIOS GLOBAL
axios.defaults.headers.common['X-Auth-Token']='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// GET REQUEST
function getTodos() {
  /*  ONE WAY OF DOING IT
  axios({
    method:'get',
    url:'https://jsonplaceholder.typicode.com/posts',
    params:{
      _limit:5
    }
  })
  .then((res)=>showOutput(res))
  .catch((err)=>console.log(err))
  */

  /* ANOTHER WAY => WITH AXIOS METHOD CAN BE WRITTEN WITH AXIOS
  axios.get('https://jsonplaceholder.typicode.com/posts',{
    params:{ _limit:5}
  })
  .then((res)=>showOutput(res))
  .catch((err)=>errorHandling(err))
  */
 //WE CAN PASS PARAMS ALONG WITH URL, MAKING CODE EVEN SHORTER
 //IN CASE OF GET REQUESTS, WE DONT NEED .get BUT WE DO SO TO MAKE OUR CODE READABLE
 axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
 .then((res)=>showOutput(res))
 .catch((err)=>errorHandling(err))
}

// POST REQUEST 
//COULD BE DONE LONGER WAY

function addTodo() {
  /*
  axios({
    method:'post',
    url:'https://jsonplaceholder.typicode.com/todos',
    data:{
      title:'New Todo Item',
      completed:false
    }
  })
  .then((res)=>showOutput(res))
  .catch((err)=>console.log(err))
  */

  //DOING IT THE EASIER WAY
  axios.post('https://jsonplaceholder.typicode.com/todos',{
      title:'new todo item',
      completed:false
    }
  )
  .then((res)=>showOutput(res))
  .catch((err)=>errorHandling(err))
}

// PUT/PATCH REQUEST
// PUT REQUEST REPLACES THE ENTIRE ITEM WITH A NEW UPDATED ITEM
// PATCH ONLY UPDATES ENTERED DATA
function updateTodo() {
  axios.patch('https://jsonplaceholder.typicode.com/todos/1',{ //id has to be added to url
      title:'updated todo item',
      completed:false
    }
  )
  .then((res)=>showOutput(res))
  .catch((err)=>errorHandling(err))
}

// DELETE REQUEST
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/todos/1')   //id has to be added to url
  .then((res)=>showOutput(res))
  .catch((err)=>errorHandling(err))
}

// SIMULTANEOUS DATA
function getData() {
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
  //.then(res=>showOutput(res[0]))   indexing have to be used for accessing result
  //.catch(err=>errorHandling(err[0]))  indexing have to be used for accessing error
  .then(axios.spread((todos,posts)=>showOutput(posts))) //names are given to outputs
  .catch(axios.spread((todos,posts)=>errorHandling(posts)))
}

// CUSTOM HEADERS (sent with request, carry additional info and auth tokens)
function customHeaders() {
  let config={
    headers:{
      'Content-Type':'applpication/json',
      Authorization:'token'
    }
  }
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',config)
 .then((res)=>showOutput(res))
 .catch((err)=>errorHandling(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options={
    method:'post',
    url:'https://jsonplaceholder.typicode.com/todos',
    data:{
      title:'Hello World',
    },
    transformResponse : axios.defaults.transformResponse.concat(data=>{
      data.title=data.title.toUpperCase();
      return data;
    })
  };
  axios(options).then(res=>showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  axios.get('https://jsonplaceholder.typicode.com/todosa?_limit=5',{
      //we can select to only throw error on certain conditions
    validateStatus:function(status){
      return status<500 //Reject only if status is >= 500 (server error)
    }
  })
 .then((res)=>showOutput(res))
 .catch((err)=>{
    if(err.response){
      //Server responded with a status othen than 200 range
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)
    }
    else if (err.request){
      //request was made but there was no response
      console.log(err.request)
    }
    else{
      console.log(err.message)
    }
 })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{
    cancelToken:source.token
  })
 .then((res)=>showOutput(res))
 .catch(thrown=>{
  if(axios.isCancel(thrown)){
    console.log('Request Cancelled :', thrown.message)
  }
 })
 if(true){
  source.cancel('Denied')
 }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config=>{
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);
  return config
},error=>{
  return Promise.reject(error);
});

// AXIOS INSTANCES (creating instances to we can easily use it later)
//creating isntance baseurl
const axiosInstance=axios.create({
  baseURL:'https://jsonplaceholder.typicode.com'
});
//using it
//axiosInstance.get('/comments?_limit=5').then(res=>showOutput(res))

//setting timeouts to requests
//axios.get('https://jsonplaceholder.typicode.com/todos',{timeout:5})
//.then(res=>showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
