import Web3 from 'web3';

let web3;

 // We are in the browser and metamask is running.
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
}
// We are on the server *OR* the user is not running metamask
else {
	const provider = new Web3.providers.HttpProvider(
  		'https://rinkeby.infura.io/0BV7iyuV0BspX0nZAlS2'
  	);
  	web3 = new Web3(provider);
}

export default web3;