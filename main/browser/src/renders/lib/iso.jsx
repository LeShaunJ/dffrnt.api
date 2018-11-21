'use strict';

module.exports = (function ISO(global, space, REST, user, path) {


	////////////////////////////////////////////////////////////////////////
	// VARIABLES -----------------------------------------------------------

		global.NMESPC = space; 

		// Requires
		const 	PAGE 	= NMESPC.page;

		const   React 	= require('react');
		const	Reflux 	= require('reflux');
		const  Actions 	= require('../../actions')(Reflux);
		const   COMPS	= require('./components')(global, Reflux, Actions);
		const RDOMServ 	= require('react-dom/server');
		const  Stores	= COMPS.Stores;
		const  Spaces	= {
			Auth: COMPS.Spaces['accessor'],
			Page: COMPS.Spaces[NMESPC.name],
		};
		const    App	= React.createFactory(COMPS.Elements[TC(PAGE.main)].App);
		const   Data	= Spaces.Page.Data[0].bind(REST)(path);
		const   Build	= {
			Auth: Spaces.Auth.Build(Actions, Stores),
			Page: Spaces.Page.Build(Actions, Stores),
		};

		Reflux.initStore(Stores.App);
		Reflux.initStore(Stores.Data);

		const   Single	= Stores.App.singleton;
		const   State	= Single.state;

		// Build.Page(Data, TITLE);

		const   Styles	= State.style.replace(/\n */g,' ');

		return {
			Styles:	Styles,
			HTML: 	'',
			State: 	Single.state,
			Call: 	Spaces.Page.Call,
			Auth: 	function (title) {
				global.TITLE  = title; 
				Single.reset();
				Build.Auth(user, TITLE);
			},
			Render: function (Build, Data) {
				return function Render(res) {
					Build.Page(res||Data, TITLE);
					return RDOMServ.renderToString(App());
				}.bind(this)
			}(Build, Data),
			Build: 	function (Build, Data, App) {
				return function Builder(res) {
					Build.Page(res||Data, TITLE);
					return App.singleton.state;
				}.bind(this)
			}(Build, Data, Stores.App)
		};
});
