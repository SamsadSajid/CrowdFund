import React, { Component } from "react";
import { Card, Button } from 'semantic-ui-react';
import factory from "../Ethereum/factory";
import Layout from '../Components/layout';
import { Link } from '../routes';


class CampaignIndex extends Component{

	// get initial rendering of data before rendering any componenets
	// follow this
	static async getInitialProps(){
		const campaigns = await factory.methods.getDeployedCampaigns().call();

		// return campaigns as props to CampaignIndex
		return {campaigns} // equivalent to return{campaigns: campaigns}
		// this is es2016 syntax
	}

	renderCampaigns(){
		// campaigns from the below line comes from static function getInitialProps
		// .map iterate over the items
		const items = this.props.campaigns.map(address => {
			return{
				header: address,
				description: (
					<Link route={`/campaigns/${address}`}>
						<a>
							View Campaign
						</a>
					</Link>
				),
				fluid: true
			};
		});

		return <Card.Group items = {items}/>;
	}

	render(){
		return (
			<Layout>
				<div>
					<h3>Open Campaigns</h3>
					<Link route="/campaigns/new">
						<a>
							<Button
				                floated="right"
				                content="Create Campaign"
				                icon="add circle"
				                primary
	              			/>
						</a>
					</Link>
	              	{this.renderCampaigns()}
				</div>
			</Layout>
		);
	}
}

export default CampaignIndex;