const axios = require('axios');
const response = axios.post('/mobile-verification', {
    phone: +971569906635
});

console.log(response);
