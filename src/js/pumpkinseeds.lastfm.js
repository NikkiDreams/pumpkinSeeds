/* Pumpkin Seeds Global lastfms
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('lastfm');


pks.lastfm = {
	init: function () {
		if (pks.core.model.isClassReady) {
			pks.lastfm.controller.events.classIsReady();
		}
		else {
			$(document).on('pks.api:isReady', function () {
				pks.lastfm.controller.events.classIsReady();
			});
		}
	},
	constants: {
		requestParameters: {},
		en_us:{}
	},
	model: {
		isClassReady: false,
		isModelReady: false,
		jsonResponse: null,
		isFormValid: false
	},
	controller: {
		events: {
			classIsReady: function () {
				$(document).trigger('pks.lastfm:isReady');
				pks.api.model.isClassReady = true;
				pks.core.api.logger('Event: pks.lastfm:isReady');

				pks.lastfm.view.init();
			}
		}
	},
	validation: null,
	/** All public interface functions  */
	/**
	* This method constructs the URL used to request a REST service ?
	* */
	getLastfmAPI: function (apiURL, apiParams) {
		var LASTFM_REST_URL = (apiURL)?apiURL:'api/lastfmapi',
			params = (apiParams)?apiParams:'nowplaying.php/nikkidreams',
			requestProtocol = 'http:',
			requestHost = window.location.host,
			pksLastfmURL,
			formatedParamters = null;

		if (window.location.protocol === 'http:') {
			requestProtocol = 'http:';
		} else {
			requestProtocol = 'https:';
		}

		pksLastfmURL = requestProtocol + '//' + requestHost + '/' + LASTFM_REST_URL + '/' + params;
		/*formatedParamters = pks.lastfm.getQueryParameters();
		if (formatedParamters !== null) {
			pksLastfmURL = pksLastfmURL + '?' + formatedParamters;
		}
		*/

		$.get(pksLastfmURL).done(function(data){
			pks.lastfm.model.jsonRespnse = data;
			$(document).trigger('pks.lastfm:dataResponse:Ready');
		});

		//return pksLastfmURL;
	},
	view:{
		init:function(){
			pks.lastfm.view.displayCurrentSongPlaying();
		},
		displayCurrentSongPlaying : function(serName){
			/*
			
			*/
			pks.lastfm.getLastfmAPI();

			$(document).on('pks.lastfm:dataResponse:Ready', function(){
				var data = {
					'_meta' : {
						'subject' : {
							'_type' : 'user',
							'is_music' : false,
							'name' : 'NikkiDreams',
							'url' : '/user/NikkiDreams'
						},
						'url' : '/user/NikkiDreams/now'
					},
					'tracks': pks.lastfm.model.jsonRespnse,
					'contentId': 'lastfm_current_song',
					'extraStyle': 'col-md-offset-1 relative'
				},
					lastTemplate = $.templates(pks.templates.PKS_LASTFM_CURRENT_SONG_PLAYING),
					html = lastTemplate.render(data),
					contenId = 'pks_core_examples',
					targetContainer = pks.api.createViewContainer(contenId,null,null);

				$('#'+contenId+' > .row:first-child').append(html);
			});
		}
	}

};


pks.lastfm.init();