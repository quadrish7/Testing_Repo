const NYPostSchema = require('./countries/us/schemas/sites/nypost_schema');
const DeciderSchema = require('./countries/us/schemas/sites/decider_schema');
const PageSixSchema = require('./countries/us/schemas/sites/pagesix_schema');
const TheSunUkSchema = require('./countries/us/schemas/sites/thesunuk_schema');
const TheTimesSchema = require('./countries/us/schemas/sites/thetimes_schema')
const TheSunIESchema = require('./countries/us/schemas/sites/thesunie_schema');
const TheScottishSunSchema = require('./countries/us/schemas/sites/thescottishsun_schema');
const TheSunUsSchema = require('./countries/us/schemas/sites/the-sunus_schema');
const TalkSportSchema = require('./countries/us/schemas/sites/talksport_schema');
const DreamTeamFcSchema = require('./countries/us/schemas/sites/dreamteamfc_schema');
const PENewsSchema = require('./countries/us/schemas/sites/penews_schema');
const WSJSchema = require('./countries/us/schemas/sites/wsj_schema');
const InvestorsSchema = require('./countries/us/schemas/sites/investors_schema');
const MarketWatchSchema = require('./countries/us/schemas/sites/marketwatch_schema');
const BarronsSchema = require('./countries/us/schemas/sites/barrons_schema');
const FnLondonSchema = require('./countries/us/schemas/sites/fnlondon_schema');
const MansionGlobalSchema = require('./countries/us/schemas/sites/mansionglobal_schema');
const RealtorSchema = require('./countries/us/schemas/sites/realtor_schema');
const MovingSchema = require('./countries/us/schemas/sites/moving_schema');
const BibleGatewaySchema = require('./countries/us/schemas/sites/biblegateway_schema');
const NCAudienceSchema = require('./countries/us/schemas/sites/nc_audience_schema');
const cookie = require('./cookie');

const {validateHost} = require('./countries/us/schemas/sites/utils');

class Contexts {

	constructor(params){
		this.params = params;
	}

	getContext(params){
		if(!params)
			return;
		// NYPOST
		if(validateHost('nypost.com')){
			return NYPostSchema.getAllSchemas(params);
		}
		else if(validateHost('decider.com')){
			return DeciderSchema.getAllSchemas(params);
		}
		else if(validateHost('pagesix.com')){
			return PageSixSchema.getAllSchemas(params);
		}
		//NewsUk
		else if(validateHost('thesun.co.uk')){
			return TheSunUkSchema.getAllSchemas(params);
		}
		else if(validateHost('thetimes.co.uk')){
			return TheTimesSchema.getAllSchemas(params);
		}
		else if(validateHost('thesun.ie')){
			return TheSunIESchema.getAllSchemas(params);
		}
		else if(validateHost('thescottishsun.co.uk')){
			return TheScottishSunSchema.getAllSchemas(params);
		}
		else if(validateHost('the-sun.com')){
			return TheSunUsSchema.getAllSchemas(params);
		}
		else if(validateHost('talksport.com')){
			return TalkSportSchema.getAllSchemas(params);
		}
		else if(validateHost('dreamteamfc.com')){
			return DreamTeamFcSchema.getAllSchemas(params);
		}
		else if(validateHost('penews.com')){
			return PENewsSchema.getAllSchemas(params);
		}
		// Dow Jones
			// works for both wsj.com and ace.wsj.com
		else if(validateHost('wsj.com')){
			return WSJSchema.getAllSchemas(params);
		}
		else if(validateHost('marketwatch.com')){
			return MarketWatchSchema.getAllSchemas(params);
		}
		else if(validateHost('barrons.com')){
			return BarronsSchema.getAllSchemas(params);
		}
		else if(validateHost('fnlondon.com')){
			return FnLondonSchema.getAllSchemas(params);
		}
		else if(validateHost('mansionglobal.com')){
			return MansionGlobalSchema.getAllSchemas(params);
		}
		else if(cookie.findCookieDomain().includes('investors.com')){
			return InvestorsSchema.getAllSchemas(params);
		}
		//Realtor.com
		else if(validateHost('realtor.com')){
			return RealtorSchema.getAllSchemas(params);
		}
		else if(validateHost('moving.com')){
			return MovingSchema.getAllSchemas(params);	
		}
		//HarperCollins
		else if(validateHost(('biblegateway.com'))){
			return BibleGatewaySchema.getAllSchemas(params);
		}
		//NewsCorp
		else if( validateHost('ncaudienceexchange.com')){
			return NCAudienceSchema.getAllSchemas(params);
		}
		return params.countrySchemas.getAllSchemas(params);
	}
}

module.exports = new Contexts;