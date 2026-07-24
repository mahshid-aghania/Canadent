function SGPBAnalyticsApi()
{

}

SGPBAnalyticsApi.prototype.getEventsList = function()
{
	var list = {
		'pageview': 1,
		'sgpbLoad': 2,
		'sgpbOnScroll': 3,
		'Click': 4,
		'Hover': 5,
		'sgpbInactivity': 6,
		'close': 7,
		'sgpbInsideclick': 8,
		'sgpbConfirm': 9,
		'sgpbIframe': 10,
		'sgpbAttronload': 11,
		'sgpbSubscriptionSuccess': 12,
		'sgpbContactSuccess': 13,
		'sgpbExitIntent' : 14,
		'sgpbPopupContentClick' : 15,
		'sgpbRecentSales' : 16
	};

	return list;
};

SGPBAnalyticsApi.prototype.send = function(params)
{
	if (Object.getOwnPropertyNames(params).length == 0) {
		return false;
	}
	/*Convert event to id for save to db*/
	var eventId = this.convertEventNameToId(params.eventName);
	params.eventName = eventId;
	params.eventId = eventId;
	var sentData = this.shouldSend(params);
	if (!sentData) {
		return false;
	}

	this.sendViaAjax(params);
};

SGPBAnalyticsApi.prototype.shouldSend = function(params)
{
	var eventId = params.eventId;
	if (!eventId) {
		return 0;
	}

	return true;
};

SGPBAnalyticsApi.prototype.convertEventNameToId = function(eventName)
{
	var eventsList = this.getEventsList();

	/*If event does not Exist return -1*/
	var issetEvent = eventsList.hasOwnProperty(eventName);
	if (!issetEvent) {
		return 0;
	}
	var eventId = eventsList[eventName];

	return eventId;
};

SGPBAnalyticsApi.prototype.sendViaAjax = function(params)
{
	var data = {
		nonce: SGPB_ANALYTICS_PARAMS.nonce,
		action: 'sgpb_analytics_send_data',
		params: params
	};

	jQuery.post(SGPB_ANALYTICS_PARAMS.ajaxUrl, data, function(response) {

	});
};
