const plugin = require('./code');

describe('Code Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = new Buffer('let foo = "bar";');
    const path = 'foo.js';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should alter the content if the html file does not include any <sky-code> tags.', () => {
    const content = new Buffer('<p></p>');
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should convert the inner HTML of all <sky-code> to HTML entities if the "escapeCharacters" flag is true.', () => {
    const content = new Buffer(`
      <sky-code escapeCharacters="true">
        <p>My content</p>
        {{ myVar }}
        $(document).ready();
      </sky-code>
    `);
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toContain('&lt;p>My content&lt;/p>');
    expect(result.toString()).toContain('{{ \'{\' }}{{ \'{\' }} myVar }}');
  });

  it('should not convert the inner HTML of all <sky-code> to HTML entities if "escapeCharacters" attribute is not true', () => {
    const content = new Buffer(`
      <sky-code>
        <p>My content</p>
        {{ myVar }}
        $(document).ready();
      </sky-code>
      <sky-code escapeCharacters="fooBar">
        <p>My content</p>
        {{ myVar }}
        $(document).ready();
      </sky-code>
    `);
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).not.toContain('&lt;p>My content&lt;/p>');
    expect(result.toString()).not.toContain('{{ \'{\' }}{{ \'{\' }} myVar }}');
  });
});
