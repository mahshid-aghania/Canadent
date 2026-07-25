function SGPBEdd()
{
	this.savedEvents = [];
	this.cartArgs = [];
	this.popupId = 0;
}

SGPBEdd.prototype.setId = function(popupId)
{
	this.popupId = popupId;
};

SGPBEdd.prototype.getId = function()
{
	return this.popupId;
};

SGPBEdd.prototype.setSavedEvents = function()
{
	var popupId = this.getId();
	var options = SGPBPopup.getPopupOptionsById(popupId);
	var events = false;

	if (typeof options['sgpb-edd-special-events'] != 'undefined') {
		events = options['sgpb-edd-special-events'][0];
	}

	this.savedEvents = events;
};

SGPBEdd.prototype.getSavedEvents = function()
{
	return this.savedEvents;
};

SGPBEdd.prototype.setCartArgs = function()
{
	this.cartArgs = SgpbEddParams;
};

SGPBEdd.prototype.updateEddParams = function(cartArgs)
{
	window['SgpbEddParams'] = cartArgs;
};

SGPBEdd.prototype.getCartArgs = function()
{
	return this.cartArgs;
};

SGPBEdd.prototype.isSatisfy = function()
{
	var cartArgs = this.getCartArgs();
	var savedEvents = this.getSavedEvents();
	if (!Object.keys(savedEvents).length) {
		if (savedEvents == false) {
			return true;
		}

		return false;
	}
	var satisfy = true;

	for (var i in savedEvents) {
		var currentEvent = savedEvents[i];

		var condition = currentEvent['operator'];


		if (condition == 'select_behavior') {
			continue;
		}
		var satisfy = false;

		if (condition == 'product-is') {
			var savedProducts = Object.keys(currentEvent['value']);

			for (var key in savedProducts) {
				if (savedProducts.hasOwnProperty(key)) {
					if (cartArgs['products-ids'].indexOf(savedProducts[key]) != -1) {
						satisfy = true;
						break;
					}
				}
			}
		}
		else if (condition == 'number-of-product') {
			satisfy = cartArgs['number-of-product'] >= currentEvent['value'];
		}
		else if (condition == 'number-of-product-lower') {
			satisfy = cartArgs['number-of-product'] <= currentEvent['value'];
		}
		else if (condition == 'total-price') {
			satisfy = parseInt(cartArgs['total-price']) >= parseInt(currentEvent['value']);
		}
		else if (condition == 'total-price-lower') {
			satisfy = parseInt(cartArgs['total-price']) <= parseInt(currentEvent['value']);
		}
		else if (condition == 'cart-is-empty') {
			satisfy = cartArgs['number-of-product'] == 0;
		}

		if (!satisfy) {
			break;
		}
	}

	return satisfy;
};

SGPBEdd.prototype.allowToOpen = function(popupId)
{
	this.setId(popupId);
	this.setSavedEvents();
	this.setCartArgs();

	return this.isSatisfy();
};

SGPBEdd.getEddPopupTypeByButtonClick = function()
{
	var popups = [];
	var popupsData = jQuery('.sg-popup-builder-content');
	if (!popupsData) {
		return popups;
	}

	popupsData.each(function() {
		var isEddPopup = false;
		var currentData = jQuery(this);
		var popupId = currentData.data('id');
		var popupData = currentData.data('options');

		var events = currentData.attr('data-events');
		events = jQuery.parseJSON(events);

		for (var i in events) {
			var event = events[i];
			if (event.param == SgpbEddGeneralParams.eddAddToCartKey) {
				isEddPopup = true;
				break;
			}
		}

		if (isEddPopup) {
			var popupObj = new SGPBPopup();
			popupObj.setPopupId(popupId);
			popupObj.setPopupData(popupData);
			popups.push(popupObj);
		}

	});

	return popups;
};

SGPBEdd.openByAddedToCart = function(cartArgs)
{
	/*There is/are all popup(s) with the event add to cart*/
	var popups = SGPBEdd.getEddPopupTypeByButtonClick();
	var currentCartArgs = {
		'total-price': cartArgs['sgpbTotalPrice'],
		'number-of-product': cartArgs['cart_quantity'],
		'products-ids': cartArgs['sgpbProductsIds']
	};

	for (var i in popups) {
		var popup = popups[i];
		var popupId = popup.getPopupId();
		var popupOptions = popup.getPopupData();
		var delay = parseInt(popupOptions['sgpb-popup-delay']) * 1000;

		var eddObj = new SGPBEdd();
		eddObj.updateEddParams(currentCartArgs);
		if (eddObj.allowToOpen(popupId)) {
			SGPBEdd.openPopup(popup, delay)
		}
	}
};

SGPBEdd.openPopup = function(popup, delay)
{
	setTimeout(function() {
		popup.prepareOpen();
	}, delay);
};

SgpbEventListener.prototype.sgpbEddAddToCart = function()
{
	jQuery(document.body).bind('edd_cart_item_added', function(e, cartArgs) {
		SGPBEdd.openByAddedToCart(cartArgs);
	});
};
