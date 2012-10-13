deploy:
	@./scripts/deploy.py

readme:
	@markdown README.md > README.html

test:
	@NODE_ENV=test ./scripts/test.py 

config:
	@echo '{ "port": 8000, "persist": false, "viewpath": "./webapp/", "knxHost": "localhost", "kinectpath": "./test/stubs/child_stub.py" }' > conf.json

clean:
	rm -rf node_modules README.html conf.json

.PHONY: readme deploy tests config test
