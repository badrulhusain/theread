
const http = require('http');

const data = JSON.stringify({
  name: "New Author",
  email: "author_" + Date.now() + "@example.com",
  password: "securepassword123",
  role: "AUTHOR"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', responseBody);
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.write(data);
req.end();
