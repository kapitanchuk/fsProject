import axios from 'axios'
//custom instance defaults
//will be applied to every request


export const $api = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true //in order to be able to attach cookies to every request
})



$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('Access_token')}`
    return config
})


export const $axios = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true //in order to be able to attach cookies to every request
})

$axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('Access_token')}`
    return config
})

let originalReq = null

$axios.interceptors.response.use(config => {
    // console.log('config from axios interceptor',config)
    return config
}
    , err => {
        // console.log(err.response.data.originalReq)
        if (err.response.status === 401) {
            originalReq = err.response.data.originalReq
            console.log('original req: ',originalReq)
            console.log('Message from axios interceptor : (cought 401 eror)access token was expired and now trying to refresh')
            return $api.get('user/refresh')
                .then(response => {
                    console.log('Message from axios interceptor (response from "user/refresh"): sending refreshed access token to for "user/auth"')
                    localStorage.setItem('Access_token', response.data.tokens.tokens.access_token)

                    return $api.get('user/auth')
                        .then(final => {
                            console.log('Message from axios interceptor: user successfully refreshed')
                            switch(originalReq.method){
                                case 'GET':return $api.get(`${originalReq.url.split('api')[1]}`)
                                case 'POST':return $api.post(`${originalReq.url.split('api')[1]}`,originalReq.body)
                                case 'PUT':return $api.put(`${originalReq.url.split('api')[1]}`,originalReq.body)
                                // case 'DELETE': // later implementation
                                default: return final // unexpected method so returns only user
                            }
                            //i have to redirect this part to send initial request that was interrupted due to expiration date of access_token 
                        })
                        .catch(finalErr => {
                            return Promise.reject(finalErr)//final error
                        })
                })
                .catch(error => {
                    console.log('Message from axios interceptor (response from "user/refresh"): refresh was expired or something else happened')
                    return Promise.reject(error)//if refresh token deprecated, or something else
                })
        }
        console.log('Message from axios interceptor: error.status !== 401 ')
        return Promise.reject(err)//if error status != 401
    }
)

