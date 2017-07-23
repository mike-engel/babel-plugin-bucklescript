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
