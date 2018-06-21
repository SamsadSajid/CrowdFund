pragma solidity ^0.4.17;

contract CampaignFactory{
	address[] public deployedCampaigns;

	function createCampaign(uint minimum) public{

		// for createCampaign, msg.sender is the creator who is creating the
		// contract. But when this contract calling the constructor of
		// Campaign, the msg.sender in the Campaign contract is the
		// address of the createCampaign contract. So, we're passing the
		// creator's address along with the constructor.
		address newCampaign = new Campaign(minimum, msg.sender);

		deployedCampaigns.push(newCampaign);
	}

	function getDeployedCampaigns() public view returns(address[]){
		return deployedCampaigns;
	}
}

contract Campaign{

	struct Request{
		string description;
		uint amount;
		address recipient;
		bool isCompleted;
		uint approvalCount;
		mapping(address => bool) approvals;
	}

	Request[] public requests;
	address public manager;
	uint public minimumContribution;
	mapping(address => bool) public approvers;
	uint public approversCount;

	modifier restricted{
		require(msg.sender == manager);
		_;
	}

	function Campaign(uint minimum, address creator) public{
		manager = creator;
		minimumContribution = minimum;
	}

	function contribute() public payable{
		require(msg.value > minimumContribution); // try with >=

		approvers[msg.sender] = true;
		approversCount++;
	}

	function createRequest(string description, uint amount, address recipient) public restricted{
		Request memory newRequest = Request({
			description: description,
			amount: amount,
			recipient: recipient,
			isCompleted: false,
			approvalCount: 0
			// we don;t have to initialise those vars which are of reference types
		});

		requests.push(newRequest);
	}

	function approveRequest(uint index) public{
		Request storage request = requests[index];

		// The person needs to donate to call approveRequest
		require(approvers[msg.sender]);

		// The person cannot approve twice the same request
		require(!request.approvals[msg.sender]);

		request.approvals[msg.sender] = true;
		request.approvalCount++;
	}

	function finalizeRequest(uint index) public restricted{
		Request storage request = requests[index];

		// atleast 50% of the donator have to approve
		require(request.approvalCount > (approversCount/2));

		// cannot finalize the request which has already been completed
		require(!request.isCompleted);

		// transfer the amount to the recipient's address
		request.recipient.transfer(request.amount);

		// complete the request
		request.isCompleted = true;
	}

	function getSummary() public view returns(uint, uint, uint, uint, address){
		return(
			minimumContribution,
			this.balance,
			requests.length,
			approversCount,
			manager
		);
	}

	function getRequestsCount() public view returns(uint){
		return requests.length;
	}
}