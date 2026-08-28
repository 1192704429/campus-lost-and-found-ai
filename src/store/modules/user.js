import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import CryptoJS from 'crypto-js'

// 密码加密函数
export function encryptPassword(password) {
  // 添加盐值（可从服务器获取或本地存储）
  const salt = "lost_and_found_system";
  // 拼接盐值和密码
  const saltedPassword = salt + password;
  // 使用SHA-256加密
  const encrypted = CryptoJS.SHA256(saltedPassword).toString();
  return encrypted;
}


// 获取默认的用户信息state
const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password, captcha, captchaKey } = userInfo
    let encryptedPassword = encryptPassword(password);
    console.log(encryptedPassword);
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: encryptedPassword,
        captcha: captcha,
        captchaKey: captchaKey
      }).then(response => {
        const { data } = response
        // 登录成功后，完全清除旧的用户信息，确保路由守卫重新获取
        commit('RESET_STATE')
        commit('SET_TOKEN', data)
        setToken(data)
        // 注意：动态路由会在登录页面和路由守卫中清除
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('校验失败，请重新登录。')
        }
        // 存储用户基础信息
        const { name, avatar, role, id } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        commit('SET_ID', id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

