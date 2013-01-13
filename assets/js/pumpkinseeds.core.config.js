/* Pumpkin Seeds Core Config 
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks.core Namespace */
pks.namespace('core.config');

pks.core.config = {
	init_logger: "#init_logger",
	isLogger: false,
	isCurrentUser: false,
	init: function () {
		/* This is more of a safety mechinism than anything else. 
		* 100% assurance pks.core.config is available before we do stuff
		*/
		if (pks.core.model.isPksCoreActive) {
			pks.core.controller.events.configIsReady();
		}
		else {
			$(document).bind("pks.dom:isReady", function () {
				pks.core.controller.events.configIsReady();
			});
		}
	},
	constants: {
		requestParameters: {},
		templates: null,
	}
};


pks.core.config.init();
