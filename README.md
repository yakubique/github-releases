# github-releases

Get list of GitHub releases for repository

## Usage

For live examples, please see [actions](https://github.com/yakubique/github-releases/actions/workflows/test-myself.yaml)

```yaml
uses: yakubique/github-releases@1.0.0
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  repository: yakubique/orogene
```

## With pre-releases

```yaml
uses: yakubique/github-releases@1.0.0
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  repository: yakubique/orogene
  pre: 'true'
```

## Sort versions

```yaml
uses: yakubique/github-releases@1.0.0
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  repository: yakubique/orogene
  sortVersions: 'desc'
```

## Use output

```yaml
steps:
  - uses: yakubique/github-releases@1.0.0
    id: get_releases
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    with:
      repository: yakubique/orogene
  - run: |
      echo "${{ steps.get_releases.outputs.releases }}"
```

## Inputs

### `repository`

**Required** Repository to get releases from (_example_: `"yakubique/github-releases"`).

### `pre`

_Optional_ Include the pre-releases (_default_: `"false"`)

### `sort`

_Optional_ Sort releases by publication date `["ASC", "DESC"]` (_default_: `"ASC"`)

### `debug`

_Optional_ Be verbal (_default_: `'false'`)

### `details`

_Optional_ Add publication date, name and prerelease status to return values (_default_: `'false'`)

If `false` (_default_):

```json
{
  "releases": [
    "v0.3.26",
    "v0.3.22",
    "v0.3.23",
    "v0.3.25",
    "v0.3.31",
    "v0.3.34"
  ]
}
```

If `true`:

```json
{
  "releases": [
    {
      "name": "v0.3.26",
      "tag_name": "v0.3.26",
      "prerelease": false,
      "published_at": "2023-08-07T09:43:28Z"
    },
    {
      "name": "v0.3.22",
      "tag_name": "v0.3.22",
      "prerelease": false,
      "published_at": "2023-11-12T10:58:00Z"
    },
    {
      "name": "v0.3.23",
      "tag_name": "v0.3.23",
      "prerelease": false,
      "published_at": "2023-11-12T10:59:27Z"
    },
    {
      "name": "v0.3.25",
      "tag_name": "v0.3.25",
      "prerelease": false,
      "published_at": "2023-11-12T11:01:20Z"
    },
    {
      "name": "v0.3.31",
      "tag_name": "v0.3.31",
      "prerelease": false,
      "published_at": "2023-11-12T11:17:17Z"
    },
    {
      "name": "v0.3.34",
      "tag_name": "v0.3.34",
      "prerelease": false,
      "published_at": "2023-11-12T11:21:59Z"
    }
  ]
}
```

## Outputs

### `releases`

Package's releases
