/**
 * Created by pat on 15-04-14.
 */

/**
 * Expose `DocFailures`.
 */

exports = module.exports = DocFailures;

/**
 * Initialize a new `DocFailures` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function DocFailures(runner) {
  Base.call(this, runner);

  var self = this
      , stats = this.stats
      , total = runner.total
      , indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  function escape(html) {

    return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
  }

  function clean(str) {
    str = str
        .replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '')
        .replace(/^function *\(.*\) *{|\(.*\) *=> *{?/, '')
        .replace(/\s+\}$/, '');

    var spaces = str.match(/^\n?( *)/)[1].length
        , tabs = str.match(/^\n?(\t*)/)[1].length
        , re = new RegExp('^\n?' + (tabs ? '\t' : ' ') + '{' + (tabs ? tabs : spaces) + '}', 'gm');

    str = str.replace(re, '');

    return str.replace(/^\s+|\s+$/g, '');
  };

  runner.on('suite', function (suite) {
    if (suite.root) return;
    ++indents;
    console.log('%s<section class="suite">', indent());
    ++indents;
    console.log('%s<h1>%s</h1>', indent(), escape(suite.title));
    console.log('%s<dl>', indent());
  });

  runner.on('suite end', function (suite) {
    if (suite.root) return;
    console.log('%s</dl>', indent());
    --indents;
    console.log('%s</section>', indent());
    --indents;
  });

  runner.on('fail', function (test, err) {
    console.log('%s  <dt class="error">%s</dt>', indent(), escape(test.title));
    var code = escape(clean(test.fn.toString()));
    console.log('%s  <dd class="error"><pre><code>%s</code></pre></dd>', indent(), code);
    console.log('%s  <dd class="error">%s</dd>', indent(), escape(err));
  });
}