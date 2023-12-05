const NEWSIQ_VENDOR_ID = 709;

var ConsentTag = {
    consentOk : function(domain){
            if(!domain)                
                return true;
            if (!this.tcfAPIExists())
                return true;   
            if(!this.gdprApplies(domain))
                return true;
            else if(this.isNewsiqConsentOk())
                return true;
            else
                return false;
            
    },
    gdprApplies : function(domain){
        var tcfApiRetVal = true;
        try{
            __tcfapi('ping',2,(pingData, success)=>{
                tcfApiRetVal = (success && pingData.gdprApplies) ;
            })
            return tcfApiRetVal;
        }
        catch (e) {
            return true;
        }
    },
    isNewsiqConsentOk : function(){
        var tcfApiRetVal = false;
        try{
            __tcfapi('addEventListener', 2, (tcData, success) => {
               tcfApiRetVal = success &&  !!tcData.purpose && tcData.purpose.consents["1"] && !!tcData.vendor.consents && tcData.vendor.consents[NEWSIQ_VENDOR_ID];
              });
              return tcfApiRetVal;
        }
        catch(e){
            return false;
        }  
    },
    tcfAPIExists : function(){
        return typeof __tcfapi === 'function';
    }
};
module.exports = ConsentTag;