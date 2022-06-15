# vorlesung08 Restful Web-Service für die Suchmaschine

## Restful Webservice

NodeJS Projekt mit Express und helmet

```
$npm i express
$npm i helmet
$npm i mongodb
```

express ist die NodeJS Bibliothek für den Restful http Web Service, helmet ist für die 
http Header

Es ist auch empfohlen, für Entwicklungszwecke das sog. nodemon zu installieren, weil damit der Server nur einmal gestartet werden muss und jede Änderung in den js-Files zu einem automatischen Neustart des Service führt

```
$npm i -D nodemon
```

Ausgeführt wird der nodemon dann mit 

```
$npx nodemon restserver.js
```

Dieser startet dann den Service auf Port 8000

Der WebService kann dann mit

```
http://localhost/search/searchword
```

aufgerufen werden.
