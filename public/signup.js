document
  .querySelector('.signup-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let passwordConfirm = document.querySelector('#confirm-password').value;

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.success == true) {
      window.setTimeout(() => {
        location.assign('/expenses');
      }, 1500);
    } else {
      console.log('Some error occcured');
    }
  });
