/* Pumpkin Seeds Templates
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('templates');


pks.templates = {
	init: function () {
		if (pks.api.model.isClassReady) {
			pks.templates.controller.events.classIsReady();
		}
		else {
			$(document).on('pks.api:isReady', function () {
				pks.templates.controller.events.classIsReady();
			});
		}
	},
	model: {
		isClassReady: false,
		isModelReady: false,
		isTemplatesReady: false
	},
	controller: {
		setTemplates: function () {
			if(pks.templates.model.isTemplatesReady){
				$.templates({
					pksTemplate: pks.templates.PKS_TEMPLATE
				});
			}
		},
		events: {
			classIsReady: function () {
				$(document).trigger('pks.templates:isReady');
				pks.templates.model.isClassReady = true;
				pks.core.api.logger('Event: pks.templates:isReady');
				pks.templates.controller.events.templatesReady();
			},
			templatesReady: function () {
				if(typeof _jsv === 'object'){
					pks.templates.model.isTemplatesReady = true;
					pks.core.api.logger('Event: pks.templates:isTemplatesReady');
					$(document).trigger('pks.templates:isTemplatesReady');
					pks.templates.controller.setTemplates();
				}
			}
		}
	},
	PKS_TEMPLATE: '<div>SOME HTML FRAGMENT</div>',
	PKS_API_DATA_SAMPLE_SECTION: '\
		<div class="col-md-10 {{: extraStyle }}" id="{{: contentId }}">\
			<div class="content">\
				<h2>PKS Core JSON Response</h2> \
				<label>API Name: {{: API }}</label>\
				<label>API Version: {{: version }}</label>\
				<h5>Sample Data: {{: seed_name }}</h5>\
				<label>data.geolocation.country.USA.states:<br/><pre>{{: geolocation }}</pre></label>\
				<label>data.user.identity:<br/><pre>{{: identity }}</pre></label>\
				<label>data.user.orientation:<br/><pre>{{: orientation }}</pre></label>\
				<label>data.user.status:<br/><pre>{{: status }}</pre></label>\
			</div>\
		</div>',
	PKS_LASTFM_CURRENT_SONG_PLAYING: '\
		<div class="col-md-5 {{: extraStyle }}" id="{{: contentId }}">\
			<div class="nowplaying content  clearfix">\
		        <div class="nowPlayingBg cssBGfilters full-width-overlay">\
		            <div class="art" style="background-image: url({{: tracks[0].images.extralarge}});"></div>\
		        </div>\
		        <div class="track-details-wrapper" data-utc="{{: tracks[0].utc}}">\
	                <div class="track-details">\
	                    <a class="artwork media-pull-left media-link-hook" href="{{: tracks[0].url}}">\
	                        <img src="{{: tracks[0].images.mega}}" alt="Artwork for {{: tracks[0].name}}" />\
	                    </a>\
	                    <div class="media-body">\
                            <div class="vertically-center track-meta">\
                                <h3 class="now-playing-subtext">\
                                    <a href="{{: _meta.subject.url}}" class="strong">{{: _meta.subject.name}}</a> is playing\
                                    <a href="{{: _meta.subject.url}}" class="strong hide">{{: _meta.subject.name}}</a> <span class="hide">just played</span>\
                                    <a href="{{: _meta.subject.url}}" class="strong hide">{{: _meta.subject.name}}</a> <span class="hide">last played</span>\
                                </h3>\
                                <a href="{{: tracks[0].url}}" class="track-name">{{: tracks[0].name}}</a>\
                                <div class="artist-name">\
                                    by <a href="{{: tracks[0].artist.url}}">\
                                        {{: tracks[0].artist.name}}\
                                    </a>\
                                </div>\
                                <div class="album-name">\
                                    {{: tracks[0].album.name}}\
                                </div>\
                            </div>\
	                    </div>\
	                </div>\
		        </div>\
		        <div data-page-title class="hide">\
		            {{: tracks[0].name}} by {{: tracks[0].artist.name}} (now playing)\
		            {{: tracks[0].name}} by {{: tracks[0].artist.name}} (just listened)\
		            {{: tracks[0].name}} by {{: tracks[0].artist.name}} (last played track)\
		            No recent tracks - Last.fm\
		        </div>\
		        <div class="no-content-message hide">\
		            Sorry, {{: _meta.subject.name}} hasn’t played any tracks recently.<br /><a href="{{: _meta.subject.url}}">Return to their profile</a>.\
		        </div>\
		    </div>\
	    </div>'

};


pks.templates.init();