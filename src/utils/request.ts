import Taro from '@tarojs/taro';
// import {options} from "@tarojs/runtime";
export const request = (options) => {
    return Taro.request({
        ...options,
        header:{
            'Authorization': `Bearer ${Taro.getStorageSync('token')}`
        }
    }).then(res=>res.data)
};
