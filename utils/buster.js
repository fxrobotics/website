const fs = require('fs');
const md5 = require('md5');
const files = fs.readdirSync('./dist');
const re = new RegExp(/.*\.html$/);
const imageRe = new RegExp(/"[/a-zA-Z0-9-_.]+\.(png|jpg|svg|js|css)"/g);

const writeFile = (path, content) => {
  fs.writeFileSync(path, content, function (err) {
    if (err) return console.log(err);
  });
};

replacements = {};

for (let i = 0; i < files.length; i++) {
  const outfile = `dist/${files[i]}`;
  if (re.test(outfile)) {
    let imageMap = {};
    let html = fs.readFileSync(outfile, 'utf-8');
    let result;
    while ((result = imageRe.exec(html)) !== null) {
      const match = result[0];
      const file = match.replace(/^"/, '').replace(/"$/, "");
      const imageBytes = fs.readFileSync('dist/' + file);
      const hash = md5(imageBytes);
      const replace = `${file.substr(0, file.lastIndexOf('.'))}-${hash}${file.substr(file.lastIndexOf('.'))}`;
      const outfile = `dist/${replace}`;
      writeFile(outfile, imageBytes);
      imageMap[match] = replace;
    }
    replacements[outfile] = imageMap;
  }
}

Object.keys(replacements).forEach(outfile => {
  let html = fs.readFileSync(outfile, 'utf-8');
  const replace = replacements[outfile];
  Object.entries(replace).forEach(v => {
    html = html.replace(v[0], v[1]);
  });
  console.log(`Writing file: ${outfile}`);
  writeFile(outfile, html);
});
