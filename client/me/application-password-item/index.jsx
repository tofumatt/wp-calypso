/** @format */

/**
 * External dependencies
 */

import React from 'react';
import createReactClass from 'create-react-class';
import { localize } from 'i18n-calypso';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { recordGoogleEvent } from 'state/analytics/actions';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import { errorNotice } from 'state/notices/actions';
import Button from 'components/button';

const ApplicationPasswordsItem = createReactClass( {
	displayName: 'ApplicationPasswordsItem',

	getInitialState: function() {
		return {
			removingPassword: false,
		};
	},

	handleRemovePasswordButtonClick() {
		this.props.recordGoogleEvent( 'Me', 'Clicked on Remove Application Password Button' );
		this.removeApplicationPassword();
	},

	removeApplicationPassword: function() {
		this.setState( { removingPassword: true } );

		this.props.appPasswordsData.revoke(
			parseInt( this.props.password.ID, 10 ),
			function( error ) {
				if ( error && 'unknown_application_password' !== error.error ) {
					this.setState( { removingPassword: false } );
					this.props.errorNotice(
						this.props.translate(
							'The application password was not successfully deleted. Please try again.'
						)
					);
				}
			}.bind( this )
		);
	},

	render: function() {
		var password = this.props.password;
		return (
			<li className="application-password-item__password" key={ password.ID }>
				<div className="application-password-item__details">
					<h2 className="application-password-item__name">{ password.name }</h2>
					<p className="application-password-item__generated">
						{ this.props.translate( 'Generated on %s', {
							args: this.props.moment( password.generated ).format( 'MMM DD, YYYY @ h:mm a' ),
						} ) }
					</p>
				</div>
				<Button
					borderless
					className="application-password-item__revoke"
					onClick={ this.handleRemovePasswordButtonClick }
				>
					<Gridicon icon="cross" />
				</Button>
			</li>
		);
	},
} );

export default connect( null, dispatch =>
	bindActionCreators( { errorNotice, recordGoogleEvent }, dispatch )
)( localize( ApplicationPasswordsItem ) );
