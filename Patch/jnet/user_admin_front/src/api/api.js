import axios from 'axios';
let instance = axios.create({
    headers: {'content-type': 'application/x-www-form-urlencoded'}
});
