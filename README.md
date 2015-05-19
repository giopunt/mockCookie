# mockCookie
A simple way to mock document.cookie functionality in your Javascript when testing using Jasmine.

My recommendation is always to define and use an internal variable using window or document (or any other browser global object).
This will give you the possibility to mock the behaviour of your code and make it flexible and testable.

# Usage

var AwesomeObj = function(window, document) {
    this.location = window.location;
    this.document = document;
    this.checkAffIdPrameterExistence();
};

AwesomeObj.prototype.checkAffIdPrameterExistence = function() {
    var awesomeQueryParam = this.getParameterByName('awesome');
    var awesomeCookieValue = this.getCookie('awesomeCookie');
    
    if(awesomeQueryParam){
        if(awesomeQueryParam !== awesomeCookieValue){
             this.setCookie("awesomeCookie", awesomeQueryParam, 30);
        }
    }
};

AwesomeObj.prototype.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)", "i"),
        results = regex.exec(this.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

AwesomeObj.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var ca = this.document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }
    return "";
};

AwesomeObj.prototype.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    this.document.cookie = cname + "=" + cvalue + "; domain=; path=/; " + expires;
};

new AwesomeObj(window, document);

# TESTS

When you test you'll be able to use our mockDocument to see if the cookie has been set:

describe("AwesomeObj Spec", function() {
    
    var mockWindow;
    var getMockCookieValue;
    var mockDocument;
    var mockAwesomeParam;
    var mockCookieValue;
    var cookieValue;
    
    beforeEach(function(){
        
        mockWindow = {
            location: {
                search: ""
            }
        };

        mockDocument = {
            value_: {}, 

            get cookie() {
                var output = [];
                for (var cookieName in this.value_) {
                    output.push(cookieName + "=" + this.value_[cookieName]);
                }
                return output.join(";");
            },

            set cookie(s) {
                if(s){
                    var indexOfSeparator = s.indexOf("=");
                    var key = s.substr(0, indexOfSeparator);
                    var value = s.substring(indexOfSeparator + 1);
                    this.value_[key] = value;
                    return key + "=" + value;
                }
            }
        };

        getMockCookieValue = function(cname){
            var name = cname + "=";
            var ca = mockDocument.cookie;
            ca = ca.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
            }
            return "";
        };
        
        mockAwesomeParam = "1234";
    });
    
    describe("When awesome paramenter IS present in the query", function() {
    
        describe("Expect awesome cookie", function() {
            
            beforeEach(function(){
                mockWindow.location.search = "?awesome=" + mockAwesomeParam;
                cookieValue = "not-awesome";
                mockDocument.cookie = "awesomeCookie=" + cookieValue + "; domain=; path=/; expires=1434555910537";
                
                new AwesomeObj(mockWindow, mockDocument);
            });

            it("to be updated with the new value", function() {
                expect(getMockCookieValue("awesomeCookie")).toBe(mockAwesomeParam);
            });
            
        });
    });
    
    
    describe("When awesome paramenter IS NOT present in the query", function() {
        
        describe("And awesome cookie is empty/not defined", function() {
    
            beforeEach(function(){
                mockWindow.location.search = "";
                mockDocument.cookie = "";

                new AwesomeObj(mockWindow, mockDocument);
            });

            it("Expect asosAffiliate cookie to be empty/not defined", function() {
                expect(getMockCookieValue("awesomeCookie")).toBe("");
            });
        });
    
        describe("And awesome cookie is already defined ", function() {
    
            beforeEach(function(){
                mockWindow.location.search = "";
                cookieValue = "awesome";
                mockDocument.cookie = "awesomeCookie=" + cookieValue + "; domain=; path=/; expires=1434555910537";

                new AwesomeObj(mockWindow, mockDocument);
            });

            it("Expect awesomeCookie to remain the same", function() {
                expect(getMockCookieValue("awesomeCookie")).toBe(cookieValue);
            });
        });
    });
    
});
