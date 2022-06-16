# vorlesung08 Restful Web-Service für die Suchmaschine

## Restful Webservice

NodeJS Projekt mit Express

```
$npm i express
$npm i mongodb
$npm i bs58
```

express ist die NodeJS Bibliothek für den RESTful http Web Service, 

helmet ist für die Bibliothek für http-Header im produktiven Einsatz

Es ist auch empfohlen, für Entwicklungszwecke das sog. nodemon zu installieren, weil damit der Server nur einmal gestartet werden muss und jede Änderung in den js-Files zu einem automatischen Neustart des Service führt

```
$npm i -D nodemon
```

Ausgeführt wird der RESTful Webservice mit 

```
$npx nodemon restserver.js
```

Dieser startet den Service auf Port 8000

Die Web-Seite index.html kann dann mit

```
http://localhost:8000
```

aufgerufen werden. 
