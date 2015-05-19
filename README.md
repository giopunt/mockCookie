# mockCookie
A simple way to mock document.cookie functionality in your Javascript when testing using Jasmine.

My recommendation is always to define and use an internal variable using window or document (or any other browser global object).
This will give you the possibility to mock the behaviour of your code and make it flexible and testable.

Eg.

var AsosAffiliateId = function(window, document) {
    this.location = window.location;
    this.document = document;
    this.affId;
    this.checkAffIdPrameterExistence();
};

AsosAffiliateId.prototype.checkAffIdPrameterExistence = function() {
    var affIdParameter = this.getParameterByName('affId');
    var affIdCookieValue = this.getAsosAffiliateCookie();
    var affIdUsablenetCookieValue = this.getUsablenetAffiliateCookie();

    /*
    1. set the cookie if the ASOS cookie is not set
    2. set the cookie if the ASOS cookie value is different than the query affid value
    3. set the Usablenet cookie if not set yet, also if one of UN is missing.
    */
    if ( affIdParameter !== "" ) {
        if ( ( affIdParameter !== affIdCookieValue ) ) {
            this.affId = affIdParameter;
            this.setAsosAffiliateCookie();
        }
        if ( ! this.isUsablenetAffiliateCookieSet() || ( affIdParameter !== affIdUsablenetCookieValue )) {
            this.affId = affIdParameter;
            this.setAsosAffiliateCookie();
        }
    }
};

