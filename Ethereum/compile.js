const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

// removes a folder/file. Extra feat of fs
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contract', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// ensureDir checks if direcotory exists/. If not creates a directory.
fs.ensureDirSync(buildPath);

for (let contract in output) {
	fs.outputJsonSync(
		// two contract can be found from the compiled output.
		// One is CampaignFactory
		// Another is Campaign
		path.resolve(buildPath, contract.replace(':', '') + '.json'),
		output[contract]
	);
}