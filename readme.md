# name-your-contributors

[![Greenkeeper badge](https://badges.greenkeeper.io/mntnr/name-your-contributors.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/mntnr/name-your-contributors.svg?branch=master)](https://travis-ci.org/mntnr/name-your-contributors)

> Name your GitHub contributors; get commits, issues, and comments

`name-your-contributors` gets all of the code reviewers, commenters, issue and PR creators from your organization or repo.

## Install

```
$ npm install --save name-your-contributors
```

### API Limits and setting up a GitHub Token

You also need to get a GitHub application token to access the API. Go here:
https://github.com/settings/tokens. Click on "Generate New Token". It needs to
have the `read:org` scope in order to search by organization. Name the token
something informative: `name-your-contributors` is a good name.

Set the token with the variable name `$GITHUB_TOKEN` before running the script:

```sh
$ export GITHUB_TOKEN=ab34e...
```

You can also set the var automatically in every session by adding the above line
to your `.bashrc` file in your home directory.

#### Caveats

GitHub regulates API traffic by a credit system. The limits are quite high; it's
permitted to query hundreds of repos per hour using the `repoContributors`
function, but some organisations have many hundreds of repos, and a single call
to `orgContributors` could potentially exhaust your entire hourly quota. The
WikiMedia Foundation is a good example of an org with way too many repos for
this app to handle.

Unfortunately filtering by contributions before or after a given date has no
effect on quota use, since the data still needs to be queried before it can be
filtered.

For more details on rate limits, see
https://developer.github.com/v4/guides/resource-limitations/.

## Usage

### From Code

```js
const nyc = require('name-your-contributors')

nyc.repoContributors({
	token: process.env.GITHUB_TOKEN,
	user: 'mntnr',
	repo: 'name-your-contributors'
	}).then(//do something with the results
	)
})

nyc.orgContributors({
	token: process.env.GITHUB_TOKEN,
	orgName: 'ipfs',
	before: '2017-01-01',
	after: '2016-01-01'
	}).then(...)
```

### From the Command Line

```sh
$ npm install -g name-your-contributors

$ export GITHUB_TOKEN={your-token}

$ name-your-contributors -u mntnr -r name-your-contributors

$ name-your-contributors -o ipfs -a 2017-01-01 > ipfs-contrib.json

$ name-your-contributors --config config.json > combined-out.json
```

### Config File

For batching convenience, Name Your Contributors takes a config file which
specifies a token, a list of repos, and a list of orgs to grab. The
`config.json.example` is an outline of this file format:

```json
{
  "token": "123435abcdf",
  "repos": [{
	"login": "mntnr",
	"repo": "name-your-contributors",
	"before": "2017-11-30",
	"after": "2017-06-01"
  }, {
	"login": "mntnr",
	"repo": "whodidwhat"
  }],
  "orgs": [{
	"login": "adventure-js",
	"after": "2017-07-01"
  }]
}
```

A token passed in the config file will override any token present in the
environment.

The output when passed a config file is a mirror of the config file with the
token removed and a `contributions` key added to each object, like so:

```json
{
  "repos": [{
	"login": "mntnr",
	"repo": "name-your-contributors",
	"before": "2017-11-30",
	"after": "2017-06-01",
	"contributions" : {
	  "commitAuthors": [...],
	  "commitCommentators": [...],
	  ,,,
	},
	...
  }],
  "orgs": [...]
}
```

The output will be in the format:

```sh
$ name-your-contributors -u mntnr -r name-your-contributors --after 2017-11-10

{
  "commitAuthors": [],
  "commitCommentators": [],
  "prCreators": [],
  "prCommentators": [
	{
	  "login": "RichardLitt",
	  "name": "Richard Littauer",
	  "url": "https://github.com/RichardLitt",
	  "count": 3
	},
	{
	  "login": "tgetgood",
	  "name": "Thomas Getgood",
	  "url": "https://github.com/tgetgood",
	  "count": 2
	}
  ],
  "issueCreators": [
	{
	  "login": "RichardLitt",
	  "name": "Richard Littauer",
	  "url": "https://github.com/RichardLitt",
	  "count": 1
	}
  ],
  "issueCommentators": [
	{
	  "login": "tgetgood",
	  "name": "Thomas Getgood",
	  "url": "https://github.com/tgetgood",
	  "count": 1
	},
	{
	  "login": "RichardLitt",
	  "name": "Richard Littauer",
	  "url": "https://github.com/RichardLitt",
	  "count": 1
	}
  ],
  "reactors": [
	{
	  "login": "patcon",
	  "name": "Patrick Connolly",
	  "url": "https://github.com/patcon",
	  "count": 1
	}
  ],
  "reviewers": []
}
```

## API

### orgContributors({orgName, token, before, after})

#### token

Type: `string`

Github auth token

#### org

Type: `string`

The organization to traverse. If no organization is provided, the script
will find the username and repo for the local git repository and use that.

#### opts.after

Type: `string`

The ISO timestamp to get contributors after.

Any string that will be accepted by `new Date("...")` will work here as
expected.

#### opts.before

Type: `string`

Get contributors from before this ISO timestamp.

### repoContributors({user, repo, token, before, after})

#### opts.user

Type: `string`

Github user name to whom the repo belongs.

#### opts.repo

Type: `string`

Only traverse the given repository.

## Development

There are several extra flags that are useful for development and diagnosing
issues:

`-v, --verbose` prints out each query that is sent to the api along with its
cost and the quota remaining after it is run.

`--debug` prints out each query sent to the server and the raw response. This is
extremely verbose.

`--dry-run` prints the cost of the first query that would have been run *without
running it*. Note that since the query isn't executed, follow up queries aren't
possible. when used with the `-c, --config` option, dry runs the first query for
each entry of the config file.

## License

MIT © [Richard Littauer](http://burntfen.com)
