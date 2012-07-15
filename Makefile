deploy:
	@./scripts/deploy.py

readme:
	@markdown README.md > README.html

test:
	@NODE_ENV=test mocha -t 3200 

config:
	@echo '{ "port": 8000, "persist": false, "viewpath": "../../../webapp/smartwebapp", "wlanNotify": true, "wlanInterv": 1000, "wlanHost": "http://baall-server-2.informatik.uni-bremen.de", "wlanPort": 8080, "wlanPath": "/setPosition", "kinectpath": "./test/stubs/child_stub.py" }' > conf.json

clean:
	rm -rf node_modules README.html conf.json

.PHONY: readme deploy tests config test
