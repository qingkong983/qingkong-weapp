import { request } from "../utils/request";
import {config} from "../config";

export class UserService {
    static wxLogin (params){
        return request({
            url: config.baseUrl + '/user/wxLogin',
            data: params,
            method: 'POST'
        })
    }
    static profile (params){
        return request({
            url: config.baseUrl + '/user/getuserinfo',
            data: params,
            method: 'GET'
        })
    }

    static wxCreateAndUpdate (params){
        return request({
            url: config.baseUrl + '/user/wxCreateAndUpdate',
            data: params,
            method: 'POST'
        })
    }


}
