include ./.env

start:
	$(MAKE) kill clean install dependencies run

kill:
	docker kill $$(docker ps -q)

clean:
	docker system prune -a -f --volumes

install:
	chmod -R 0777 $(CURDIR)
	docker-compose up -d --build
	chmod -R 0777 $(CURDIR)

dependencies:
	chmod -R 0777 $(CURDIR)
	npm i
	chmod -R 0777 $(CURDIR)

run:
	npm start

git-config:
	git config user.name $(GIT_NAME)
	git config user.email $(GIT_EMAIL)

push:
	$(MAKE) git-config
	git add .
	git commit -m "[`date +'%Y-%m-%d'`] - work in progress."
	git push

down:
	docker-compose down

webserver:
	docker exec -it webserver bash

status:
	@echo "**************************************************"
	docker ps -a
	@echo "**************************************************"
	docker images
	@echo "**************************************************"
	docker volume ls
	@echo "**************************************************"

import:
	docker exec mongodb bash -c 'mongoimport --authenticationDatabase admin \
											--uri $(MONGO_URI) \
											--db $(MONGO_DB) \
											--collection $(MONGO_COLLECTION) \
											--file /opt/$(MONGO_FILE_NAME)'
