declare namespace Express {
  export interface Request {
    user_sk?: string
    user_id?: number
    user_name?: string
    login_user?: import('../class/sys-login-user.js').SysLoginUser
  }
}
