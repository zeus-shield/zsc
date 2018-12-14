import axios from 'axios';
axios.defaults.withCredentials = false;
let instance = axios.create({
    headers: {'content-type': 'application/x-www-form-urlencoded'}
});
// let formInstance =  axios.create({
//     headers: {'content-Type': 'multipart/form-data'}
// });
// let base = 'http://localhost:3001';


//jnet

export const getTrack   = params => { return instance.post(`${base}/Order/getTrack`,params).then(res => res.data); };

export const getNums    = params => { return instance.post(`${base}/Order/getNums`,params).then(res => res.data); };

export const addOrder   = params => { return instance.post(`${base}/Order/add`,  params ).then(res => res.data ); };

export const getOrder   = params => { return instance.get(`${base}/Order/getOrder`, { params: params }); };

export const getContractInfo   = params => { return instance.get(`${base}/Order/getContractInfo`, { params: params }); };

export const getContractInfoForAdm   = params => { return instance.get(`${base}/Order/getContractInfoForAdm`, { params: params }); };

export const saveCode   = params => { return instance.post(`${base}/Code/saveCode`,  params ).then(res => res.data ); };

export const getCode   = params => { return instance.get(`${base}/Code/getCode`, { params: params }); };