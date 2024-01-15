import * as core from '@actions/core';
import { InputOptions } from '@actions/core';
import { context } from "@actions/github";

enum Inputs {
    Repository = 'repository',
    PreReleases = 'pre',
    Debug = 'debug',
    Details = 'details',
    SortVersions = 'sort',
}

function isBlank(value: any): boolean {
    return value === null || value === undefined || (value.length !== undefined && value.length === 0);
}

function isNotBlank(value: any): boolean {
    return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
}

export function getBooleanInput(name: string, options?: InputOptions): boolean {
    const value = core.getInput(name, options);
    return isNotBlank(value) &&
        ['y', 'yes', 't', 'true', 'e', 'enable', 'enabled', 'on', 'ok', '1']
            .includes(value.trim().toLowerCase());
}

export interface ActionInputs {
    repository: string;
    owner: string;
    preReleases: boolean;
    debug: boolean;
    details: boolean;
    sortVersions: number;
}

export function getInputs(): ActionInputs {
    const result: ActionInputs | any = {};

    const repository = core.getInput(Inputs.Repository, { required: false });
    if (isBlank(repository)) {
        result.repository = `${context.repo.repo}`
        result.owner = `${context.repo.owner}`
    } else if (repository.includes('/')) {
        const [owner, repo] = repository.split('/')
        result.repository = repo
        result.owner = owner
    } else {
        result.repo = repository
        result.owner = `${context.repo.owner}`
    }

    let sortVersions = core.getInput(Inputs.SortVersions, { required: false });
    if (isBlank(sortVersions)) {
        result.sortVersions = -1;
    } else {
        sortVersions = sortVersions.trim().toLowerCase();
        if (sortVersions === 'asc') {
            result.sortVersions = -1;
        } else if (sortVersions === 'desc') {
            result.sortVersions = 1;
        } else {
            core.warning("Unexpected value of `sortVersions`. Using default instead.");
            result.sortVersions = -1;
        }
    }

    result.debug = getBooleanInput(Inputs.Debug, { required: false });
    result.preReleases = getBooleanInput(Inputs.PreReleases, { required: false });
    result.details = getBooleanInput(Inputs.Details, { required: false });

    return result;
}
