REST API server to fetch bitcoin and ethereum address for a user from a given seed
## Requirements (required)
- make sure you have ```.GENERATOR_API_Configrc``` <br /> and ```.GENERATOR_API_Secretrc``` files 
configured. <br />
schema for them can be found in config => schema.js 
- seed can be 12/24 bip39 words represented in a single string separated by single space
- example seed :- ```"loud speak raise fork ready lazy tiny spot demise citizen switch chief"```

## Installation (required)
1) clone the repo <br />```git clone https://github.com/itsover9000angrynoises/addressGenerator.git```
2) ```cd addressGenerator```
3) run ```npm install```
4) run ```npm run start``` to start the server 
5) run ```npm run test``` to run the tests 

## APIS 
- to get the address for the user run ```curl  localhost:8000/v1/user/{USERID}/address```