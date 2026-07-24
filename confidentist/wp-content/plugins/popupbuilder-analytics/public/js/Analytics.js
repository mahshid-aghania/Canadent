function SGPBAnalytics()
{

}

SGPBAnalytics.prototype.init = function()
{
	this.actions();
	this.popupData = {};
	this.popupTimer = '';
	this.sendPopupDataToAnalytics = false;
	this.eventName;
	this.currentId;
	this.disabledForTrackingGeneral;
	this.disabledForTrackingByPopup = {};
};

SGPBAnalytics.prototype.actions = function()
{
	this.extraConditionsToCheck();
	this.popupOpenEvents();
	this.popupCloseEvent();
};

SGPBAnalytics.prototype.extraConditionsToCheck = function()
{
	var that = this;

	jQuery(window).bind('sgpbDisableAnalytics', function(e, args) {
		that.disabledForTrackingGeneral = args.disabledInGeneral;
		that.disabledForTrackingByPopup[args.popupId] = {'disabled':args.disabledAnalytics};
	});
};

SGPBAnalytics.prototype.popupOpenEvents = function()
{
	var that = this;

	sgAddEvent(window, 'sgpbDidOpen', function(e) {
		var args = e.detail;
		var popupData = args.popupData;
		var eventName = popupData.eventName;
		if (typeof args.event != 'undefined') {
			eventName = args.event;
		}
		that.popupData = popupData;
		that.eventName = eventName;
		that.currentId = args.popupId;
		that.prepareDataToSend();
	});

	jQuery(window).bind('sgpbFormSuccess', function(e, args) {
		that.eventName = args.eventName;
		that.currentId = args.popupId;
		that.prepareDataToSend();
	});

	jQuery(window).bind('sgpbPopupContentClick', function(e, args) {
		that.eventName = args.eventName;
		that.currentId = args.popupId;
		that.prepareDataToSend();
	});
};

SGPBAnalytics.prototype.prepareDataToSend = function()
{
	var data = this.popupData;
	var params = {
		'popupId': this.currentId,
		'eventName': this.eventName
	};
	if (this.disabledForTrackingGeneral != 'undefined') {
		if (typeof this.disabledForTrackingByPopup[this.currentId].disabled == 'undefined') {
			this.sendToGoogleAnalytics(params);
		}
	}
};

SGPBAnalytics.prototype.popupCloseEvent = function()
{
	var that = this;

	sgAddEvent(window, 'sgpbDidClose', function(e) {
		var args = e.detail;
		var popupData = args.popupData;
		that.popupData = popupData;
		that.eventName = 'close';
		that.currentId = args.popupId;
		that.prepareDataToSend();
	});
};

SGPBAnalytics.prototype.getAdditionalParams = function()
{
	var params = {};

	params.ajaxurl = SGPB_ANALYTICS_PARAMS.ajaxurl;
	params.eventPageUrl = window.location.href;

	return params;
};

SGPBAnalytics.prototype.sendToGoogleAnalytics = function(sendingparams)
{
	var additionalParams = this.getAdditionalParams();
	/*Adding Aditional params to events sended data*/
	var sendingparams = Object.assign(sendingparams, additionalParams);
	var apiObj = new SGPBAnalyticsApi();
	apiObj.send(sendingparams);
};


jQuery(document).ready(function() {
	if (SGPB_ANALYTICS_PARAMS.isPreview == '') {
		analyticsObj = new SGPBAnalytics();
		analyticsObj.init();
	}
});

