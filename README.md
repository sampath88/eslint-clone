# eslint-clone

- To link a package run \
`npm link`

- To unlink a package run \
`npm rm -g <package-name>`

- The below code snippet from `package.json` \
  is defining a command-line executable named "eslint-clone". 

  ![command-line executable named "eslint-clone"](/snippet1.svg)

- When you run the "eslint-clone" command from the command line, \
  it will execute the JavaScript code in the "src/index.js" file.

- To make 'eslint-clone' as a package, run \
`npm link`

- Now you can directly use `eslint-clone` as command from your command line
  interface

- After linking the package run \
`npm run lint`