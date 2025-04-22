export function Pwd(rule: any, value: string) {
  const reg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]/;
  if (!value) {
    return Promise.reject('请输入正确的新密码');
  }
  if (!reg.test(value)) {
    return Promise.reject('新密码为4-20位的 数字或字母组成');
  }
  if (value.length > 20 || value.length < 4) {
    return Promise.reject('新密码为4-20位的 数字或字母组成');
  }
  return Promise.resolve();
}
export function checkCode(rule: any, value: string) {
  const reg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]/;
  if (!value) {
    return Promise.reject('请输入正确的验证码');
  }
  // if (!reg.test(value)) {
  //   return Promise.reject('新密码为4-20位的 数字或字母组成');
  // }
  if (value.length !== 4) {
    return Promise.reject('验证码为4位 数字或字母组成');
  }
  return Promise.resolve();
}

export function cPwd(rule: any, value: string, pwd?: string) {
  const reg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]/;
  if (!value) {
    return Promise.reject('请输入正确的新密码');
  }
  if (pwd !== value) {
    return Promise.reject('确认新密码要和新密码保持一致');
  }
  if (!reg.test(value)) {
    return Promise.reject('新密码为4-20位的 数字或字母组成');
  }
  if (value.length > 20 || value.length < 4) {
    return Promise.reject('新密码为4-20位的 数字或字母组成');
  }
  return Promise.resolve();
}
