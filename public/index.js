document.querySelector('.history-container').scrollTop =
  document.querySelector('.history-container').scrollHeight;

var options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

let today = new Date();
let tomorrow = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
let yesterday = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);

document.querySelector('.today-date').innerHTML = today.toLocaleDateString(
  'en-us',
  options
);
document
  .querySelector('.history .fa-arrow-right')
  .addEventListener('click', async (e) => {
    document.querySelector('.today-date').innerHTML =
      tomorrow.toLocaleDateString('en-us', options);
    yesterday = today;
    today = tomorrow;
    tomorrow = new Date(today.getTime() + 60 * 60 * 24 * 1000);

    let querydate = today.toISOString().substring(0, 10);
    const res = await axios({
      method: 'GET',
      url: '/api/v1/expenses/date',
      params: {
        date: querydate,
      },
    });
    if (res.data.data.length != 0) {
      document.querySelector('.history-container').innerHTML = '';
      res.data.data.forEach((el) => {
        let div = document.createElement('div');
        div.classList.add('item');
        if (el.type == 'Income') div.classList.add('income-border');
        else div.classList.add('expense-border');
        let p1 = document.createElement('p');
        let p2 = document.createElement('p');
        p1.innerHTML = el.text;
        p1.classList.add('name');
        p2.innerHTML = `₹ ${el.amount}`;
        p2.classList.add('amt');
        div.appendChild(p1);
        div.appendChild(p2);
        div.id = el.id;
        document.querySelector('.history-container').appendChild(div);
      });
    } else {
      document.querySelector('.history-container').innerHTML = '';
      let p1 = document.createElement('p');
      p1.innerText = 'No expenses here...';
      document.querySelector('.history-container').appendChild(p1);
    }
    delExpense();
  });
document
  .querySelector('.history .fa-arrow-left')
  .addEventListener('click', async () => {
    document.querySelector('.today-date').innerHTML =
      yesterday.toLocaleDateString('en-us', options);
    tomorrow = today;
    today = yesterday;
    yesterday = new Date(today.getTime() - 60 * 60 * 24 * 1000);

    let querydate = today.toISOString().substring(0, 10);
    const res = await axios({
      method: 'GET',
      url: '/api/v1/expenses/date',
      params: {
        date: querydate,
      },
    });
    if (res.data.data.length != 0) {
      document.querySelector('.history-container').innerHTML = '';
      res.data.data.forEach((el) => {
        let div = document.createElement('div');
        div.classList.add('item');
        if (el.type == 'Income') div.classList.add('income-border');
        else div.classList.add('expense-border');
        let p1 = document.createElement('p');
        let p2 = document.createElement('p');
        p1.innerHTML = el.text;
        p1.classList.add('name');
        p2.innerHTML = `₹ ${el.amount}`;
        p2.classList.add('amt');
        div.appendChild(p1);
        div.appendChild(p2);
        div.id = el.id;
        document.querySelector('.history-container').appendChild(div);
      });
    } else {
      document.querySelector('.history-container').innerHTML = '';
      let p1 = document.createElement('p');
      p1.innerText = 'No expenses here...';
      document.querySelector('.history-container').appendChild(p1);
    }
    delExpense();
  });

const addExpense = async (text, amt, type, today) => {
  const res = await axios({
    method: 'POST',
    url: '/api/v1/expenses',
    data: {
      text: text,
      amount: amt,
      type: type,
      createdAt: today,
    },
  });
  return res;
};

const delExpense = async () => {
  [...document.querySelectorAll('.item')].forEach(function (item) {
    item.addEventListener('click', async (e) => {
      let deleteItem = confirm('Are you sure you want to delete this item ?');
      if (deleteItem) {
        if (e.offsetX < 0) {
          const get = await axios({
            method: 'GET',
            url: `/api/v1/expenses/${item.id}`,
          });

          const del = await axios({
            method: 'DELETE',
            url: `/api/v1/expenses/${item.id}`,
          });
          ////////////////////////////
          let type = get.data.data.type;
          let vall = get.data.data.amount;
          if (type == 'Expense') {
            let total = document.querySelector('.bal-amt');
            let tot_amt = total.innerHTML;
            let arr = tot_amt.split(' ');
            let val = arr[1];
            val = val - -1 * vall;
            total.innerHTML = arr[0] + ' ' + val;
            ////////////////
            let inc = document.querySelector('.expense-amt');
            let inc_amt = inc.innerHTML;
            let arr1 = inc_amt.split(' ');
            let val1 = arr1[1];
            let num1 = parseInt(val1);
            val1 = num1 - vall;
            inc.innerHTML = arr1[0] + ' ' + val1;
          }
          if (type == 'Income') {
            let total = document.querySelector('.bal-amt');
            let tot_amt = total.innerHTML;
            let arr = tot_amt.split(' ');
            let val = arr[1];
            val = val - vall;
            total.innerHTML = arr[0] + ' ' + val;
            ////////////////
            let inc = document.querySelector('.income-amt');
            let inc_amt = inc.innerHTML;
            let arr1 = inc_amt.split(' ');
            let val1 = arr1[1];
            let num1 = parseInt(val1);
            val1 = num1 - vall;
            inc.innerHTML = arr1[0] + ' ' + val1;
          }
          ////////////////////////////////
        }
        item.remove();
      }
    });
  });
};

document.querySelector('.submit-btn').addEventListener('click', function (e) {
  e.preventDefault();

  let text = document.querySelector('#name').value;
  let amt = document.querySelector('#amt').value;
  let radios = document.getElementsByName('type-of');
  let type;
  for (let radio of radios) {
    if (radio.checked) {
      type = radio.value;
      break;
    }
  }

  document.querySelector('#name').value = '';
  document.querySelector('#amt').value = '';
  let div = document.createElement('div');
  div.classList.add('item');

  let res = addExpense(text, amt, type, today.toISOString());
  res.then((a) => {
    div.id = a.data.data._id;
  });

  if (type == 'Expense') div.classList.add('expense-border');
  if (type == 'Income') div.classList.add('income-border');
  let p1 = document.createElement('p');
  p1.innerText = text;
  let p2 = document.createElement('p');
  p2.innerText = `₹ ${amt}`;
  div.appendChild(p1);
  div.appendChild(p2);
  p1.classList.add('name');
  p2.classList.add('amt');
  document.querySelector('.history-container').appendChild(div);
  document.querySelector('.history-container').scrollTop =
    document.querySelector('.history-container').scrollHeight;

  let total = document.querySelector('.bal-amt');
  let tot_amt = total.innerHTML;
  let arr = tot_amt.split(' ');
  let val = arr[1];
  let num = parseInt(val);
  if (type == 'Income') val = num - -1 * amt;
  if (type == 'Expense') val = num - amt;
  total.innerHTML = arr[0] + ' ' + val;

  if (type == 'Income') {
    let inc = document.querySelector('.income-amt');
    let inc_amt = inc.innerHTML;
    let arr1 = inc_amt.split(' ');
    let val1 = arr1[1];
    let num1 = parseInt(val1);
    val1 = num1 - -1 * amt;
    inc.innerHTML = arr1[0] + ' ' + val1;
  }
  if (type == 'Expense') {
    let inc = document.querySelector('.expense-amt');
    let inc_amt = inc.innerHTML;
    let arr1 = inc_amt.split(' ');
    let val1 = arr1[1];
    let num1 = parseInt(val1);
    val1 = num1 - -1 * amt;
    inc.innerHTML = arr1[0] + ' ' + val1;
  }
  delExpense();
});
delExpense();
