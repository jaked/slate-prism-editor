module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      'prismjs', {
        'languages': ['javascript', 'css', 'html', 'markup', 'liquid'],
        'plugins': ['line-numbers', 'show-language', 'normalize-whitespace', 'copy-to-clipboard'],
        'theme': 'default',
        'css': true
      },
    ]
  ],
}
