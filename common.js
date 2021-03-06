const $ = s => document.getElementById(s);

const _ = s => chrome.i18n.getMessage(s);

const lines = s => s ? s.split('\n') : [];
const unlines = ss => ss.join('\n');

/* Async APIs */

const makeAsyncApi = callbackApi => (...args) => new Promise((resolve, reject) => {
  callbackApi(...args, result => {
    if (chrome.runtime.lastError) {
      reject(new Error(chrome.runtime.lastError.message));
      return;
    }
    resolve(result);
  });
});

const getAuthToken = makeAsyncApi((details, callback) => {
  chrome.identity.getAuthToken(details, callback);
});

const removeCachedAuthToken = makeAsyncApi((details, callback) => {
  chrome.identity.removeCachedAuthToken(details, callback);
});

const getLocalStorage = makeAsyncApi((keys, callback) => {
  chrome.storage.local.get(keys, callback);
});

const setLocalStorage = makeAsyncApi((items, callback) => {
  chrome.storage.local.set(items, callback);
});

const queryTabs = makeAsyncApi((queryInfo, callback) => {
  chrome.tabs.query(queryInfo, callback);
});

/* Block Rules */

const compileBlockRule = raw => {
  const trimmed = raw.trim();
  const mp = trimmed.match(/^((\*)|https?|ftp):\/\/(?:(\*)|(\*\.)?([^/*]+))(\/.*)$/);
  if (mp) {
    const escapeRegExp = s => s.replace(/[$^\\.*+?()[\]{}|]/g, '\\$&');
    return new RegExp(
      '^' +
      (mp[2] ? 'https?' : mp[1]) +
      '://' +
      (mp[3] ? '[^/]+' : (mp[4] ? '([^/.]+\\.)*?' : '') + escapeRegExp(mp[5])) +
      escapeRegExp(mp[6]).replace(/\\\*/g, '.*') +
      '$'
    );
  }
  const re = trimmed.match(/^\/((?:[^*\\/[]|\\.|\[(?:[^\]\\]|\\.)*\])(?:[^\\/[]|\\.|\[(?:[^\]\\]|\\.)*\])*)\/(.*)$/);
  if (re) {
    try {
      const compiled = new RegExp(re[1], re[2]);
      if (compiled.global || compiled.sticky) {
        console.warn('Unsupported regular expression flag: ' + raw);
        return null;
      }
      return compiled;
    } catch (e) {
      console.warn('Invalid regular expression: ' + raw);
      return null;
    }
  }
  return null;
};

const loadBlockRules = async () => {
  const { blacklist } = await getLocalStorage({ blacklist: '' });
  return lines(blacklist).map(raw => ({ raw, compiled: compileBlockRule(raw) }));
};

const saveBlockRules = async blockRules => {
  await setLocalStorage({
    blacklist: unlines(blockRules.map(rule => rule.raw)),
    timestamp: new Date().toISOString()
  });
  chrome.runtime.sendMessage({});
};

const deriveBlockRule = url => {
  const u = new URL(url);
  const s = u.protocol.match(/^((https?)|ftp):$/);
  return s ? (s[2] ? '*' : s[1]) + '://' + u.hostname + '/*' : null;
};
