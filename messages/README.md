README 

- I believe everything has been implemented correctly. 
- I have not collaborated with anyone
- I have spent 1h on this


-Is it possible to request the data from a different origin (e.g., http://messagehub.herokuapp.com/) or from your local machine (from file:///) from using XMLHttpRequest? Why or why not? 

Generally it not possible to request data from a different origin as the XMLHttpRequest requests will follow the browser's same-origin policy and will onyl succeed if they are made to the host that served the same origin. This is because of security reasons as, without those same-origin policy, malicious js software could easily do anything they want on your other browser pages such as use your Facebook or banking, etc. The same origin is determined by 3 criteria: protocol, port, and host. They must be the same for the code to be able to interact. 

This is why it doesn't work when I try to request data from a different origin such as my own computer and from heroku, it's because they are not the same origin.