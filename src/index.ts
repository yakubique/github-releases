import * as core from '@actions/core';
import { getOctokit } from '@actions/github';
import { ActionInputs, getInputs } from './io-helper';

enum Outputs {
    releases = 'releases',
}

function setOutputs(response: any, log?: boolean) {
    let message = '';
    for (const key in Outputs) {
        const field: string = (Outputs as any)[key];
        if (log) {
            message += `\n  ${field}: ${JSON.stringify(response[field])}`;
        }
        core.setOutput(field, response[field]);
    }

    if (log) {
        core.info('Outputs:' + message);
    }
}

interface Release {
    "url": string;
    "assets_url": string;
    "upload_url": string;
    "html_url": string;
    "id": number;
    "author": {
        "login": string;
        "id": number;
        "node_id": string;
        "avatar_url": string;
        "gravatar_id": string;
        "url": string;
        "html_url": string;
        "followers_url": string;
        "following_url": string;
        "gists_url": string;
        "starred_url": string;
        "subscriptions_url": string;
        "organizations_url": string;
        "repos_url": string;
        "events_url": string;
        "received_events_url": string;
        "type": string;
        "site_admin": boolean;
    },
    "node_id": string;
    "tag_name": string;
    "target_commitish": string;
    "name": string;
    "draft": boolean;
    "prerelease": boolean;
    "created_at": string;
    "published_at": string;
    "assets": [],
    "tarball_url": string;
    "zipball_url": string;
    "body": string;
}

interface SmallRelease {
    name: string;
    tag_name: string;
    prerelease: boolean;
    published_at: string;
}

(async function run() {
    try {
        const inputs: ActionInputs = getInputs();

        core.info(`Getting versions for:\n  repository: ${inputs.repository}\n  owner: ${inputs.owner}`);

        const github = getOctokit(process.env.GITHUB_TOKEN as string);

        const listResponse = await github.rest.repos.listReleases({
            owner: inputs.owner,
            repo: inputs.repository
        });

        if (listResponse.status !== 200) {
            throw new Error(`Unexpected http ${listResponse.status} during get release list`);
        }

        const releaseList = listResponse.data
            .filter(release => !release.draft &&
                (!release.prerelease || inputs.preReleases)) as Release[];

        const releases = releaseList.map(x => ({
            name: x.name,
            tag_name: x.tag_name,
            prerelease: x.prerelease,
            published_at: x.published_at
        })) as SmallRelease[];

        releases.sort(
            (a, b) =>
                inputs.sortVersions * (new Date(b.published_at as string).getTime() -
                    new Date(a.published_at as string).getTime()),
        );

        if (inputs.details) {
            setOutputs({ releases }, inputs.debug);
        } else {
            setOutputs({ releases: releases.map((x) => x.tag_name) }, inputs.debug)
        }

        core.info('Get release has finished successfully');
    } catch (err: any) {
        core.setFailed(err.message);
    }
})();
