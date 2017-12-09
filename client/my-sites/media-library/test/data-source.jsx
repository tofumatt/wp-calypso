/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import { expect } from 'chai';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

/**
 * Internal dependencies
 */
import MediaLibraryDataSource from 'my-sites/media-library/data-source';
import { createReduxStore } from 'state';

// we need to check the correct children are rendered, so this mocks the
// PopoverMenu component with one that simply renders `this.props.children`
jest.mock( 'components/popover/menu', () => require( 'components/show-children' ) );
jest.mock( 'config', () => {
	const config = () => 'development';
	config.isEnabled = property => property.startsWith( 'external-media' );
	return config;
} );

describe( 'MediaLibraryDataSource', () => {
	describe( 'render data sources', () => {
		test( 'does not exclude any data sources by default', () => {
			const store = createReduxStore();
			const wrapper = mount(
				<ReduxProvider store={ store }>
					<MediaLibraryDataSource source={ '' } onSourceChange={ noop } />
				</ReduxProvider>
			);
			expect( wrapper.find( 'button[action="google_photos"]' ) ).to.have.length( 1 );
			expect( wrapper.find( 'button[action="pexels"]' ) ).to.have.length( 1 );
		} );

		test( 'excludes data sources listed in disabledSources', () => {
			const store = createReduxStore();
			const wrapper = mount(
				<ReduxProvider store={ store }>
					<MediaLibraryDataSource
						source={ '' }
						onSourceChange={ noop }
						disabledSources={ [ 'pexels' ] }
					/>
				</ReduxProvider>
			);
			expect( wrapper.find( 'button[action="google_photos"]' ) ).to.have.length( 1 );
			expect( wrapper.find( 'button[action="pexels"]' ) ).to.have.length( 0 );
		} );
	} );
} );
