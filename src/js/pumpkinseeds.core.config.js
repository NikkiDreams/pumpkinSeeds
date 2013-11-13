/* Pumpkin Seeds Core Config 
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks.core Namespace */
pks.namespace('core.config');

pks.core.config = {
	init_logger: '#init_logger',
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
			$(document).on('pks.dom:isReady', function () {
				pks.core.controller.events.configIsReady();
			});
		}
	},
	constants: {
		PUMPKINSEEDS_REST_URL: '/assets/data/',
		PUMPKINSEEDS_JSON_DATA: 'seeds.json',
		JSON_ROOT_NODE: '',
		requestParameters: {
			PKS_PARAMETER: 'pks',
			USER_PARAMETER: 'pksuser'
		}
	}
};


pks.core.config.init();
