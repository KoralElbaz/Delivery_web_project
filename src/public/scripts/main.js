

// let result=prompt('what is your name?')
// //confirm("do you agree?")
// alert(`Hello ${result}`);

async function buildModel(){
    const table = document.querySelector('table');
    const dataTr = document.querySelectorAll('tr.dataTr');
    const response = await  fetch('http://localhost:3000/predictBIGML'); //bigml
    const resultsJson = await response.json();
    let tr,td1,td2,td3,td4 = null;
    if(dataTr.length){
        dataTr.forEach((tr)=>tr.remove());
    }
    
   resultsJson.data.length &&  resultsJson.data.forEach((item)=>{
        tr = document.createElement('tr');
        tr.className='dataTr';
        td1 = document.createElement('td');
        td2 = document.createElement('td');
        td3 = document.createElement('td');
        td4 = document.createElement('td');
       td1.append(item.product);
       td2.append(item.items);
       td3.append(item.coverage);
       td4.append(item.support);
       tr.append(td1,td2,td3,td4);
       table.append(tr);

       table.classList.remove('hidden');

    })
    console.log(resultsJson);

}

