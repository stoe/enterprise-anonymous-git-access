# enterprise-anonymous-git-access
> {dis,en}able anonymous Git read access on [GitHub Enterprise Server](https://github.com/enterprise) (GHES) for all organization repositories.


## Installation
1. Clone this repository
2. `cd` into the repository folder
3. Run `npm install`
4. As a GHES site admin, generate a personal access token with the `repo` scope


## Usage
```sh
$ ./index <organization> <url> <token>
```

#### Options
- `--disable`, `-d`
    Disable anonymous access *(default: false)*
- `--ghe-version`
    Set the GitHub Enterprise Server version *(default: 2.17)*

#### Examples
```sh
$ ./index acme-inc github.acme.com aaaa0000bbbb1111cccc2222dddd4444eeee5555

$ ./index acme-inc github.acme.com aaaa0000bbbb1111cccc2222dddd4444eeee5555 --disable

$ ./index acme-inc github.acme.com aaaa0000bbbb1111cccc2222dddd4444eeee5555 --ghe-version 2.17
```
