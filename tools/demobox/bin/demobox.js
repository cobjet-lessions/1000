// #!/usr/bin/env node

var marked = require('marked')
  , rend = new marked.Renderer()

rend.code = require('./render-code')

var program = require('commander')

program
  .version('1.0.0')
  .usage('[options] <file.md> <outfile.html>')
  .parse(process.argv)

if (program.args.length != 2) {
  program.help()
}

var fileName = program.args[0]
  , outName = program.args[1]

if (!fs.existsSync(fileName)) {
  console.log(fileName + ' does not exist')
  console.log()
  program.help()
}

if (!fs.existsSync(path.dirname(outName))) {
  console.log('Destination directory ' + path.dirname(outName) + ' does not exist')
  console.log()
  program.help()
}

var body
try {
  body = marked(fs.readFileSync(fileName).toString('utf8'), {renderer: renderer})
} catch (e) {
  console.log('Failed to render markdown!')
  console.log(e.message + '\n' + e.stack)
  process.exit(1)
}

var top = fs.readFileSync(__dirname + '/top.html', 'utf8')
  , bottom = fs.readFileSync(__dirname + '/bottom.html', 'utf8')

fs.writeFileSync(outName, top + body + bottom)

