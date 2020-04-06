install: install-deps

run:
	npx babel-node src/index.js

install-deps:
	npm ci

build:
	rm -rf dist
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test