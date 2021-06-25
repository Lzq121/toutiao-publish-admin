import request from '@/utils/request'
// 用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data
    })
}

// 获取用户信息
export const getUserProfile = () => {
    // const user = JSON.parse(window.localStorage.getItem('user'));
    return request({
        method: 'GET',
        url: '/mp/v1_0/user/profile',
        // headers: {
        //     Authorization: `Bearer ${user.token}`
        // }
    })
}

// 修改用户头像
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/mp/v1_0/user/photo',
        data
    })
}

// 编辑用户资料
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/mp/v1_0/user/profile',
        data
    })
}