install:
	npm install

lint:
	npx stylelint ./src/styles/**/*.scss
	npx htmlhint ./src/*.html

start:
    parcel ./src/index.html --out-dir dist

build:
    parcel build index.html --public-url ./
