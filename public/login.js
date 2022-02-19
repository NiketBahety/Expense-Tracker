if (document.currentScript.getAttribute('user') == 200)
  location.assign('/expenses');

let form = document.querySelector('.login-form .form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let email = document.querySelector(
    '.login-form .form .form__group #email'
  ).value;
  let password = document.querySelector(
    '.login-form .form .form__group #password'
  ).value;
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
    });
    if (res.data.success == true) {
      window.setTimeout(() => {
        showAlert('success', 'Logged in Successfully !!');
        location.assign('/expenses');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Incorrect Email or Password');
  }
});
