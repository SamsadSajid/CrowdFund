import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../Ethereum/campaign';
import web3 from '../Ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
	state = {
		value: '',
		errorMessage: '',
		loading: false
	};

  	onSubmit = async event => {
		event.preventDefault();

		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: '' });

		try {
	  		const accounts = await web3.eth.getAccounts();
	  		await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, 'ether')
	  	});

	  	// es6 style, it's `` not '' or ""
	  	// this refresh the show.js page after someone contribue to the campaign
	  	// Therefore no manual hard refreshing is required!
	  	Router.replaceRoute(`/campaigns/${this.props.address}`);
		} catch (err) {
	  		this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false, value: '' });
  	};

  	render() {
		return (
			// error expects a boolean. Only providing "this.state.errorMessage"
			// will generate an error. !this.state.errorMessage will flip the string to
			// boolean, i.e. if this.state.errorMessage has some value then it will be negated
			// and the result will be false. Anothe ! negate this result again resulting true.
			// Same approach if this.state.errorMessage is null
	  		<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
				<Form.Field>
		  			<label>Amount to Contribute</label>
		  			<Input
						value={this.state.value}
						onChange={event => this.setState({ value: event.target.value })}
						label="ether"
						labelPosition="right"
		  			/>
				</Form.Field>

					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button primary loading={this.state.loading}>
		  				Contribute!
					</Button>
	  		</Form>
		);
  	}
}

export default ContributeForm;