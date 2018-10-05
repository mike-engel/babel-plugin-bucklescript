# 0.5.0
> 2018-10-04

#### Breaking changes
- Update bs-platform to 4.0.0

#### Bug fixes
- Update dependencies

# 0.4.0
> 2018-04-24

#### Breaking changes
- Updates the plugin for babel v7 compat [#6](https://github.com/mike-engel/babel-plugin-bucklescript/pull/6)

# 0.3.1
> 2018-02-22

#### Bug fixes
- Included the built file with the package on npm

# 0.3.0
> 2018-02-22

#### Breaking changes
- Updated the path for bsb on windows [#5](https://github.com/mike-engel/babel-plugin-bucklescript/pull/5)

# 0.2.4
> 2017-08-11

#### Bug fixes
- Fixes the spawn args for bsb [(#2)](https://github.com/mike-engel/babel-plugin-bucklescript/pull/2)

# 0.2.3
> 2017-07-24

#### Bug fixes
- Adds a prepublish script so I don't forget to build before publishing

# 0.2.2
> 2017-07-24

#### New features
- `bsb` won't be set to watch mode if `-w` or `--watch` is not present in the cli command
- Basic and ReasonReact examples have been added

#### Bug fixes
- Fixed a bug where `[Object object]` was printed instead of the correct path for `import` statements

#### TODO
- Test this out with several different project setups and gather dev feedback

# 0.2.1
> 2017-07-23

#### Bug fixes
- The compiled file should now be included in the published module. Sorry about that!

# 0.2.0
> 2017-07-22

#### New features
- `bsb` calls have been optimized and now only run once when the plugin is loaded
- `bsb` now watched for changes as a separate process, so your reason files are always being compiled
- tests have been added and coverage is now at 100%

#### TODO
- Full examples
- Integration with different projects to ensure it works well

# 0.1.0
> 2017-07-20

The initial public release. This may contains bugs, but it works on one of my pet projects so far. Please help test it!

#### TODO
- Full examples
- Tests
- Integration with different projects to ensure it works well
