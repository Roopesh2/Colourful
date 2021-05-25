(function (w) {
  w.Colorful = {
    config: {
      tabIndex: 4,
      fontSize: 16, // in px
      enableLineNumbering: true,
      lineHeight: 20,
    },
    langs: [], // languages
    /*
    merges same type of consecutive tokens into
    single one to minimize tokens to parse
    */
    mergeSameTypes: function (tokens) {
      var tl = tokens.length;
      if (
        tokens[tl - 1].type == tokens[tl - 2]?.type &&
        tokens[tl - 1].scopeLevel == tokens[tl - 2]?.scopeLevel
      ) {
        tokens[tl - 2].token += tokens[tl - 1].token;
        tokens.pop();
      }
    },

    /** takes parsed HTML string and wraps it in a `code` tag
     */
    finishUp: function (cfg, text, markuped) {
      var complete;
      if (cfg.enableLineNumbering) {
        var lineCount = text.match(/\n/g)?.length + 1 || 1;
        complete = "<table border=0><tr><td><pre class='colorful-numberRow'>";
        for (var i = 1; i <= lineCount; i++) {
          complete += i;
          if (i < lineCount) complete += "\n";
        }
        complete +=
          '</pre></td><td><code class="colorful-code" tabindex=' +
          cfg.tabIndex +
          ">" +
          markuped +
          "</code></td></tr></table>";
      } else {
        complete =
          '<code class="colorful-code" tabindex=' +
          cfg.tabIndex +
          ">" +
          markuped +
          "</code>";
      }
      return complete;
    },
  };

  /**
   * converts characters into html char codes
   * "<" -> "&lt;"
   * ">" -> "&gt;"
   * "&" -> "&amp;"
   * @returns string replacing some characters
   */
  String.prototype.replaceSpecHTMLChars = function () {
    return this.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  /**
   * highlight all languages on page loads
   */
  w.onload = function () {
    var langs = w.Colorful.langs,
      config = w.Colorful.config;
    for (var i = 0; i < langs.length; i++) {
      var lang = langs[i];
      var codes = document.getElementsByClassName(lang + "-colorful");
      //chooses specific language compiler
      var compiler = w.Colorful[lang + "_Compiler"];
      for (var k = 0; k < codes.length; k++) {
        var block = codes[k];
        var cfg = {
          tabIndex: block.getAttribute("tabindex") || config.tabIndex,
          fontSize: block.getAttribute("fontsize") || config.fontSize,
          lineHeight: block.getAttribute("lineheight") || config.lineHeight,
          enableLineNumbering: block.hasAttribute("lineNumbering"),
        };
        compiler.compile(codes[k], cfg);
      }
    }
  };
})(window);
