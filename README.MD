Build

- install node for npm
- install typescript `npm install typescript`
- transpile with `tsc` (the configuration in tsconfig.json should suffice)

note: the project is already transpiled in `out` folder.

Running

- install http-server `npm install http-server` (to serve the video file)
- run http-server `http-server out -p 8066 --cors`
- load index.html

Notes

I tried to avoid use of any 3rd party libraries in the spirit of the assignment. no extra installation is needed apart from typescript compiler.

Unit tests and API documentation is missing due to time limitations (was defined as 2 hours) but marked my remarks as
`//DESIGN-NOTE` in the code. a project wide search for this string should reveal them.
