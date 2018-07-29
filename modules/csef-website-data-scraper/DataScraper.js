const axios = require('axios');
const cheerio = require('cheerio');

class DataScraper{
	constructor(){
		this.issuers = [];
		this.init();
	}
	
	async init(){
		try{
			const equitiseIssuers = await this.scrapeEquitise();
			equitiseIssuers.forEach(issuer => {
				this.issuers.push(issuer);
			});

			const ventureCrowdIssuers = await this.scrapeVentureCrowd();
			ventureCrowdIssuers.forEach(issuer => {
				this.issuers.push(issuer);
			});

			const onMarketIssuers = await this.scrapeOnMarket();
			onMarketIssuers.forEach(issuer => {
				this.issuers.push(issuer);
			});
		}
		catch(error){
			console.log('error: ', error);
		}

	}

	async scrapeEquitise(){
		try{
			const response = await axios.get('https://equitise.com/invest-deals');
			const equitiseIssuers = response.data;
			return equitiseIssuers.map( issuer => (
				{
					name: issuer.name,
					capitalRaised: issuer.raised,
					hostPlatform: {
						name: 'Equitise'
					}
				}
			) )	;
		}
		catch(error){
			console.log('error: ', error);
			throw error;
		}
	}

	async scrapeVentureCrowd(){
		try{
			const response = await axios.get('https://www.venturecrowd.com.au/invest');
			const ventureCrowdInvestPage = response.data;
			const $ = cheerio.load(ventureCrowdInvestPage);

			let issuerNames = [];
			$('.dtilename > .wpb_wrapper').map( (index, element) => {
				issuerNames.push($(element).text().match(/(?<=\n\t\t\t)(.*)(?=\n\n\t\t)/g)[0]);
			});

			const capitalRaised = [];
			$('.wpb_wrapper h5').map((index, element) => {
				const rawInnerText = $(element).text();
				if(rawInnerText.match(/\$/g)){
					let rawCapitalRaised = rawInnerText.split(' ')[0];
					capitalRaised.push(this.translateVentureCrowdCapitalRaised(rawCapitalRaised));
				}
			});

			return issuerNames.map( (issuerName, index) => {
				return({
					name: issuerName,
					capitalRaised: capitalRaised[index],
					hostPlatform: {
						name: 'Venture Crowd'
					}
				});
			} );
		}
		catch(error){
			console.log('error: ', error);
			throw error;
		}
	}

	translateVentureCrowdCapitalRaised(rawCapitalRaised){
		// remove the leading '$' sign
		rawCapitalRaised = rawCapitalRaised.slice(1);
		const capitalRaisedValue = rawCapitalRaised.slice(0, -1);
		const capitalRaisedMultiplier = rawCapitalRaised[rawCapitalRaised.length -1];
		let capitalRaised = capitalRaisedValue;
		switch ( capitalRaisedMultiplier ){
			case 'K':
				capitalRaised = capitalRaisedValue*1000;
				break;
			case 'M':
				capitalRaised = capitalRaisedValue*1000000;
		}
		return capitalRaised.toFixed(2);
	}

	async scrapeOnMarket(){
		try{
			const response = await axios.get('https://www.onmarket.com.au/crowdfunding-investment/');
			const onMarketInvestPage = response.data;
			const $ = cheerio.load(onMarketInvestPage);

			let issuerNames = [];
			let capitalRaised = [];

			$('.panel-heading h3').map( (index, element) => {
				issuerNames.push($(element).text().match(/(?<=\n)(.*)(?=\n)/g)[0]);
			} );

			$('.base-panel .offer-target .row').map( (index, element) => {
				capitalRaised.push(this.translateOnMarketCapitalRaised($('.col-xs-4 h3', element).first().text()));
			} );

			return issuerNames.filter( (issuerName, index) => (capitalRaised[index] !== undefined) ).map( (issuerName, index) => {
				return {
					name: issuerName,
					capitalRaised: capitalRaised[index],
					hostPlatform: {
						name: 'OnMarket'
					}
				} 
			} );
		}
		catch(error){
			console.log('error: ', error);
			throw error;
		}

	}

	translateOnMarketCapitalRaised(rawCapitalRaised){
		rawCapitalRaised = rawCapitalRaised.slice(1);
		rawCapitalRaised = rawCapitalRaised.replace(',','');
		return parseFloat(rawCapitalRaised).toFixed(2);
	}
};

module.exports = DataScraper;
