

 async function SaveExpense(event){
    event.preventDefault();
    
    const Expense = event.target.expense.value;
    const Description = event.target.description.value;
    const Category = event.target.category.value;

    const obj = {
      Expense, 
      Description,
      Category
    }
    console.log(obj)
      
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post("http://localhost:3000/add-expense", obj,{ headers: { "Authorization": token } });
            console.log(response)
          ShowUserOnScreen(response.data.newUserDetails);
    
      } catch (error) {
        console.error("An error occurred:", error);
      }
      event.target.reset();
    }
    leaderboard

async function ShowUserOnScreen(obj){
    const parentElement = document.getElementById('itemlist')
    const children = document.createElement('li');
    children.textContent = ` RECENT EXPENCE => ${obj.expense}-${obj.description}-${obj.category}`

    const deletebutton = document.createElement('input');
    deletebutton.type = "button";
    deletebutton.value = 'delete';
    deletebutton.onclick = async() => {
      console.log(obj._id)
      deleteUser(obj._id)
       parentElement.removeChild(children);
    }
    children.appendChild(deletebutton);
  parentElement.appendChild(children);
}

async function deleteUser(userid){
  try{
    const token = localStorage.getItem('token')
  console.log("id=",userid)
  
 const response =  await axios.delete(`http://localhost:3000/delete-Expense/${userid}`,{ headers: { "Authorization": token } })
 console.log(">>>>>>>>>>>>>>>>>...",response)

const response2 =  await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } })

 console.log("%%%%%%",response2.data)
  }catch(error){
    console.log(error)
  }
 
}

function showLeaderBoard(){
 
  console.log("inside showleader function")

  document.getElementById('leaderboardbutton').textContent = 'LeaderBoard';
  const leaderbutton = document.getElementById('leaderboardbutton')
  leaderbutton.textContent = 'Show LeaderBoard';
  leaderbutton.onclick = async()=>{

    const leaderboard = document.getElementById('leaderboard')
    leaderboard.innerText = 'LEADERBOARD'

    const ulist1 = document.getElementById('ulist1')

    const token = localStorage.getItem('token')

     const response3 = await axios.get('http://localhost:3000/showLeaderBoard', { headers: { "Authorization": token } })
     try{
      console.log("allleaderboardlist:", response3.data)
     if (response3.data.AllExpenses) {
      const allExpenses = response3.data.AllExpenses;
           console.log("########",allExpenses)
      ulist1.innerHTML = '';

      for (let i = 0; i < allExpenses.length; i++) {
        const expense = allExpenses[i];
        const li = document.createElement('li');
        li.textContent = `Name - ${expense.Name}   TotalExpense - ${expense.totalExpense}`;
        ulist1.appendChild(li);
      }
  
    } else {
      console.log("No Data Found Yet");
    }
  } catch (error) {
    console.log(error);
  
  }
  }

}



function showPremiumUserMessage(){
  document.getElementById('rzp-button').style.display = 'none'
    const div =  document.getElementById('divtag')
    div.textContent = 'You are a premium user';
    div.style.color = 'blue';
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


window.addEventListener("DOMContentLoaded", async() => {

    try{
      const token = localStorage.getItem('token')
      const decodeToken = parseJwt(token)
      console.log("::::::::", decodeToken)
      const ispremiumuser = decodeToken.ispremiumuser
      if(ispremiumuser){
        showPremiumUserMessage()
        showLeaderBoard()
      }
     
   const response =  await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } });
   console.log(response)
   if(response.data.message == false){
    console.log("No Data Found Yet")
   }
   else{
        for (var i = 0; i < response.data.retrievedData.length; i++) {
          const obj = response.data.retrievedData[i];
          ShowUserOnScreen(obj);
        }
      }
    }catch(error){
        console.log(error);
      };
  
    })

    document.getElementById('rzp-button').onclick = async function(e){
      const token = localStorage.getItem('token')
      console.log("%%%%%",token)
    const response =  await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });
       console.log("Razorpay2: getting order id from razorpay")
    console.log("response =",response)

var options = {
  key: response.data.key_id,// imp 
  amount: 2500,  
  currency: "INR",
  name: "Random Company",
  description: "Premium Membership",
  order_id: response.data.order.id, 
  handler: async function (response) {
    
    console.log("success response=",response)
    console.log("razorpay4: completed")
    const response2 = await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id
    }, { headers: { "Authorization": token } });

    console.log("!!!!!!!!!!!!!!!!!",response2)

    alert("You are a premium user now");
    document.getElementById('rzp-button').style.display = 'none'
    const div =  document.getElementById('divtag')
    div.textContent = 'You are a premium user';
    div.style.color = 'blue';
    localStorage.setItem('token',response2.data.token)
    showLeaderBoard()
   
  }
};

    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment.failed',async function(response){
      await axios.post("http://localhost:3000/purchase/updatetransactionFailed", {
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id
    }, { headers: { "Authorization": token } });
      console.log("response2=", response)
      console.log("not getting what is this")
      alert("something went wrong")
    })
    }


// Add event listeners for pagination buttons
document.getElementById('firstPageButton').addEventListener('click', () => changePage(1));
document.getElementById('prevPageButton').addEventListener('click', () => {
  changePage(currentPage - 1)
  console.log('currentPage P', currentPage)
});
document.getElementById('nextPageButton').addEventListener('click', () => {
  changePage(currentPage + 1)
  console.log('currentPage N', currentPage)
});
document.getElementById('lastPageButton').addEventListener('click', () => changePage(totalPages)); // Change this line

let currentPage = 1;
let totalPages = 1;

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages) return;

  currentPage = newPage;
  if (currentPage === totalPages) {

    updateExpenseTable(totalPages);
  } else {
    updateExpenseTable(currentPage);
  }
}


async function updateExpenseTable(page) {
  const itemsPerPage = parseInt(localStorage.getItem('expensesPerPage')) || 5;
 
  console.log('hitemperpage = ',itemsPerPage)
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/get-pagination?page=${page}&itemsPerPage=${itemsPerPage}`, { headers: { "Authorization": token } });
        const data = response.data;
        console.log("DDDDDDDDDDDDDDDDDDDd", data)

        // Clear the existing content
        const itemlist = document.getElementById('itemlist');
        itemlist.innerHTML = '';

        if (data.message == false) {
            console.log('length is zero');
        } else {
            if (data.retrievedData.length > 0) {
                const currentPage = data.currentPage;
                const firstItemNumber = (currentPage - 1) * itemsPerPage + 1;

                data.retrievedData.forEach((expense, index) => {
                    const li = document.createElement('li');
                    const itemNumber = firstItemNumber + index;
                    li.textContent = `${itemNumber}. ${expense.description} - ${expense.category} - ${expense.expense}`;

                    const deletebutton = document.createElement('input');
                    deletebutton.type = "button";
                    deletebutton.value = 'delete';
                    deletebutton.onclick = async () => {
                        console.log(expense.id);
                        deleteUser(expense.id);
                        itemlist.removeChild(li);
                    };

                    li.appendChild(deletebutton);
                    itemlist.appendChild(li);
                });
            }
        }

        totalPages = Math.ceil(data.totalCount / itemsPerPage)

  
            document.getElementById('firstPageButton').disabled = page === 1;
            document.getElementById('prevPageButton').disabled = page === 1;
            document.getElementById('nextPageButton').disabled = page === totalPages;
            document.getElementById('lastPageButton').disabled = page === totalPages;
        
            const paginationNumbers = document.getElementById('paginationNumbers');
            paginationNumbers.innerHTML = ''; 
            const maxDisplayedPages = 3; 
        
            let startPage = Math.max(1, page - Math.floor(maxDisplayedPages / 2));
            let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
            if (endPage - startPage < maxDisplayedPages - 1) {
              startPage = Math.max(1, endPage - maxDisplayedPages + 1);
            }
         
            for (let i = startPage; i <= endPage; i++) {
              const button = document.createElement('button');
              button.textContent = i;
        
              if (i === page) {
                button.classList.add('current-page'); 
              }
        
              button.addEventListener('click', () => changePage(i));
              paginationNumbers.appendChild(button);
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }
        
updateExpenseTable(1);

const expensesPerPageSelect = document.getElementById('expensesPerPage');

if (expensesPerPageSelect) {
  expensesPerPageSelect.addEventListener('change', function () {
    const selectedValue = expensesPerPageSelect.value;
    console.log(selectedValue)
    localStorage.setItem('expensesPerPage', selectedValue);
    changePage(1);
  });
}


async function down() {
  const a1 = document.createElement('a');
  a1.download = 'file1.txt';

  const token = localStorage.getItem('token');

  try {
    const response = await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } });
    console.log("&&&&&&&&&&&&&&&&&&&7", response.data.retrievedData);


    const jsonString = JSON.stringify(response.data.retrievedData);

    const blob1 = new Blob([jsonString], { type: "application/json" });
    console.log("blob", blob1);

    const downloadURL = URL.createObjectURL(blob1);

    a1.href = downloadURL;

    const obj = {
      fileURL: downloadURL
    };

    
    const postResponse = await axios.post('http://localhost:3000/user/postFileURL', obj, { headers: { "Authorization": token } });
    console.log(postResponse);
  
    a1.click();

  } catch (err) {
    console.error(err);
  }
}

function GetAllDownloads() {
  const token = localStorage.getItem('token');

  axios.get('http://localhost:3000/user/listOfDownloads', { headers: { "Authorization": token } })
    .then((response) => {
      if (response.status === 200) {
        const downloads = response.data.retrievedData;

        displayDownloads(downloads);
      } else {
        console.error('Request failed with status code:', response.status);
      }
    })
    .catch((error) => {
      console.error('An error occurred while fetching downloads:', error);
    });
}


function displayDownloads(downloads) {
  console.log("%%%%%%%%%%%%%%%%%%%%%", downloads)

  const downloadsContainer = document.getElementById("downloads-container");
  downloadsContainer.innerHTML = '';

  
  downloads.forEach((download) => {
    const downloadItem = document.createElement("div");
    const downloadLink = document.createElement("a");
    
    downloadLink.textContent = `File Downloaded on: ${download.createdAt}`;

    downloadLink.href = download.fileURL;

    downloadItem.appendChild(downloadLink);
    downloadsContainer.appendChild(downloadItem);
  });
}



