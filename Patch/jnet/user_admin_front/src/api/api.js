import axios from 'axios';
let instance = axios.create({
    headers: {'content-type': 'application/x-www-form-urlencoded'}
});

// let base = 'http://localhost:3001';
//jnet

export const getTrack   = params => { return instance.post(`${base}/user/getTrack`,params).then(res => res.data); };

export const getNums    = params => { return instance.post(`${base}/user/getNums`,params).then(res => res.data); };
