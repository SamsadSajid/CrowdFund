import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x335603bE3fEB1aec1c88f61e3Fb5098ec347E0d0'
);

export default instance;