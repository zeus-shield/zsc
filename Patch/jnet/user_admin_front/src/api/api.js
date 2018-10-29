import axios from 'axios';
let instance = axios.create({
    headers: {'content-type': 'application/x-www-form-urlencoded'}
});
// let formInstance =  axios.create({
//     headers: {'content-Type': 'multipart/form-data'}
// });
// let base = 'http://localhost:3001';


//jnet

export const getTrack   = params => { return instance.post(`${base}/user/getTrack`,params).then(res => res.data); };

export const getNums    = params => { return instance.post(`${base}/user/getNums`,params).then(res => res.data); };

export const addOrder   = params => { return instance.post(`${base}/user/add`,  params ).then(res => res.data ); };

export const getOrder   = params => { return instance.get(`${base}/user/getOrder`, { params: params }); };
