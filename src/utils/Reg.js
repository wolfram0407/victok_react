// const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
const passwordReg =
  /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/;
const emailReg = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.([A-Za-z0-9-]{2,})+/;
const phoneNumReg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export { passwordReg, emailReg, phoneNumReg };
