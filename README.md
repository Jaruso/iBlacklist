# iBlackList
Blocks specific sites from appearing in Google search results

## Description
This Chrome extension prevents blacklisted sites from appearing in Google search results.

The same function is already provided by [Personal Blocklist (by Google)](https://chrome.google.com/webstore/detail/personal-blocklist-by-goo/nolijncfnkgaikbjbdaogikpmpbdcdef). However, sites blocked by Personal Blocklist appear in search results for a moment and then disappear, which annoys me. iBlackList prevents blacklisted sites from appearing in search results as far as possible.

You can add rules on search result pages, or on sites to be blocked by clicking the toolbar icon. Rules can be specified either by [match patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) (e.g. `*://*.example.com/*`) or by [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) (e.g. `/example\.(net|org)/`).

## Author
[iorate](https://github.com/iorate) ([Twitter](https://twitter.com/iorate))

## License
iBlackList is licensed under [MIT License](LICENSE.txt).

In previous versions (<= 1.5.5), the icon was from [Material Design Icons](https://material.io/tools/icons/) by Google. It is licensed under [Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).
