## Aws Lambda and google cloud function solution for notification

- Check `google.js` for google cloud function
- check `app.mjs` for aws lambda function
- To deploy in aws you need to follow these steps
  - upload the file
  - create a new directory `nodejs`
  - copy `node_modules` forlder inside `nodejs` directory
  - zip node.js folder 
  - create a layer in aws and upload the folder 
  - attach the layer to the lambda function
- 
  - Set Environment variables etc
  - For google you can set auth token on environment variable    

## request sample

```
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("auth_token", "abcde");
var raw = JSON.stringify({
  "to": "subashrijal5@gmail.com",
  "from": "subash@eyemovic.com",
  "subject": "Hello ",
  "text": "How are you",
  "html": "<h2>Hello world</h2> <quote> I am bose</quote>",
  "source": "www.vuvusha.com",
  "dispatcher": "email",
  "from_name": "Subash",
  "to_name": "Subash"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://sendnotification-fzbxkyrtya-uc.a.run.app", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### You can now use this as notification service
