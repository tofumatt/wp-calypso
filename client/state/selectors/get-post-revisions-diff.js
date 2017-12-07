/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

export default function getPostRevisionsDiff(
	state,
	siteId,
	parentPost,
	fromRevisionId,
	toRevisionId
) {
	const key = `${ fromRevisionId }:${ toRevisionId }`;
	return get( state, [ 'posts.revisions.diffs', siteId, parentPost, key ], {} );
}
