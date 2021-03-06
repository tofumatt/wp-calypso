#!/usr/bin/env node

/**
 * Performs an `npm install`. Since that's a costly operation,
 * it will only perform it if needed, that is, if the packages
 * installed at `node_modules` aren't in sync over what
 * `npm-shrinkwrap.json` has. For that, modification times of both
 * files will be compared. If the shrinkwrap is newer, it means that
 * the packages at node_modules may be outdated. That will happen,
 * for example, when switching branches.
 */

const fs = require( 'fs' );
const spawnSync = require( 'child_process' ).spawnSync;

const needsInstall = () => {
	try {
		const shrinkwrapTime = fs.statSync( 'npm-shrinkwrap.json' ).mtime;
		const nodeModulesTime = fs.statSync( 'node_modules' ).mtime;
		return shrinkwrapTime - nodeModulesTime > 1000; // In Windows, directory mtime has less precision than file mtime
	} catch ( e ) {
		return true;
	}
};

if ( needsInstall() ) {
	const installResult = spawnSync( 'npm', [ 'install' ], {
		shell: true,
		stdio: 'inherit',
	} ).status;
	if ( installResult ) {
		process.exit( installResult );
	}
	fs.utimesSync( 'node_modules', Date.now(), Date.now() );

	// Cleanup old Githooks (remove in a few months from June 2017)
	const path = require( 'path' );
	const rm = file => fs.existsSync( file ) && fs.unlinkSync( file );
	rm( path.join( '.git', 'hooks', 'pre-push' ) );
	rm( path.join( '.git', 'hooks', 'pre-commit' ) );
	rm( path.join( 'bin', 'pre-push' ) );
	rm( path.join( 'bin', 'pre-commit' ) );
	process.exit( spawnSync( 'npm', [ 'run', 'install' ], {
		shell: true,
		stdio: 'inherit',
		cwd: path.join( 'node_modules', 'husky' ),
	} ).status );
}
