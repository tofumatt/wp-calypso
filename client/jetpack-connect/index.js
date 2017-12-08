/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import * as controller from './controller';
import { siteSelection } from 'my-sites/controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/jetpack/connect/:type(personal|premium|pro)/:interval(yearly|monthly)?',
		controller.connect,
		makeLayout,
		clientRender
	);

	page(
		'/jetpack/connect/:type(install)/:locale?',
		controller.redirectWithoutLocaleifLoggedIn,
		controller.connect,
		makeLayout,
		clientRender
	);

	page( '/jetpack/connect', controller.connect, makeLayout, clientRender );

	page(
		'/jetpack/connect/authorize/:localeOrInterval?',
		controller.redirectWithoutLocaleifLoggedIn,
		controller.saveQueryObject,
		controller.authorizeForm,
		makeLayout,
		clientRender
	);

	page(
		'/jetpack/connect/authorize/:interval/:locale',
		controller.redirectWithoutLocaleifLoggedIn,
		controller.saveQueryObject,
		controller.authorizeForm,
		makeLayout,
		clientRender
	);

	page(
		'/jetpack/connect/store/:interval(yearly|monthly)?',
		controller.plansLanding,
		makeLayout,
		clientRender
	);

	page(
		'/jetpack/connect/:_(akismet|plans|vaultpress)/:interval(yearly|monthly)?',
		( { params } ) =>
			page.redirect( `/jetpack/connect/store${ params.interval ? '/' + params.interval : '' }` )
	);

	page(
		'/jetpack/connect/plans/:interval(yearly|monthly)?/:site',
		siteSelection,
		controller.plansSelection,
		makeLayout,
		clientRender
	);

	page(
		'/jetpack/connect/:locale?',
		controller.redirectWithoutLocaleifLoggedIn,
		controller.connect,
		makeLayout,
		clientRender
	);

	page( '/jetpack/sso/:siteId?/:ssoNonce?', controller.sso, makeLayout, clientRender );
	page( '/jetpack/sso/*', controller.sso, makeLayout, clientRender );
	page( '/jetpack/new', controller.newSite, makeLayout, clientRender );
	page( '/jetpack/new/*', '/jetpack/connect' );
}
