import fetches from './../api/fetches.js';

let token = '';

const getToken = async () => {

  const name = prompt('Please Enter a Name:');

  if (!name) {
    alert('you must enter an unused name! try again later.');
    return;
  }

  token = await fetches.getToken(name);
  // getToken = test;
  console.log(token);

  // try {
  //   const response = await fetches.getToken(name);
  //   token = response;
  //   console.log("your generated token:", token);
  // } catch (err) {
  //   console.log('error getting token to play!', err);
  // }
}

export {getToken};