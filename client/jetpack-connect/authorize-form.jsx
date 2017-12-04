/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import LoggedOutFormLinks from 'components/logged-out-form/links';
import { getAuthorizationRemoteQueryData } from 'state/jetpack-connect/selectors';
import { getCurrentUserId } from 'state/current-user/selectors';
import { recordTracksEvent } from 'state/analytics/actions';
import EmptyContent from 'components/empty-content';
import MainWrapper from './main-wrapper';
import HelpButton from './help-button';
import JetpackConnectHappychatButton from './happychat-button';
import LoggedInForm from './auth-logged-in-form';
import LoggedOutForm from './auth-logged-out-form';

class JetpackConnectAuthorizeForm extends Component {
	static propTypes = {
		authorizationRemoteQueryData: PropTypes.object.isRequired,
		isLoggedIn: PropTypes.bool.isRequired,
		recordTracksEvent: PropTypes.func.isRequired,
	};

	componentWillMount() {
		// set anonymous ID for cross-system analytics
		this.props.recordTracksEvent( 'calypso_jpc_authorize_form_view' );
	}

	handleClickHelp = () => {
		this.props.recordTracksEvent( 'calypso_jpc_help_link_click' );
	};

	renderNoQueryArgsError() {
		return (
			<Main className="jetpack-connect__main-error">
				<EmptyContent
					illustration="/calypso/images/illustrations/whoops.svg"
					title={ this.props.translate( 'Oops, this URL should not be accessed directly' ) }
					action={ this.props.translate( 'Get back to Jetpack Connect screen' ) }
					actionURL="/jetpack/connect"
				/>
				<LoggedOutFormLinks>
					<JetpackConnectHappychatButton eventName="calypso_jpc_noqueryarguments_chat_initiated">
						<HelpButton onClick={ this.handleClickHelp } />
					</JetpackConnectHappychatButton>
				</LoggedOutFormLinks>
			</Main>
		);
	}

	renderForm() {
		return this.props.isLoggedIn ? (
			<LoggedInForm />
		) : (
			<LoggedOutForm local={ this.props.locale } path={ this.props.path } />
		);
	}

	render() {
		const { authorizationRemoteQueryData } = this.props;

		if ( typeof authorizationRemoteQueryData === 'undefined' ) {
			return this.renderNoQueryArgsError();
		}

		return (
			<MainWrapper>
				<div className="jetpack-connect__authorize-form">{ this.renderForm() }</div>
			</MainWrapper>
		);
	}
}

export { JetpackConnectAuthorizeForm as JetpackConnectAuthorizeFormTestComponent };

export default connect(
	state => ( {
		authorizationRemoteQueryData: getAuthorizationRemoteQueryData( state ),
		isLoggedIn: !! getCurrentUserId( state ),
	} ),
	{ recordTracksEvent }
)( localize( JetpackConnectAuthorizeForm ) );
