# Raspberry PI Database Setup

1. Install a 64bit os (I used Ubuntu 20.04LTS)
2. Install docker

``` bash
curl -L https://get.docker.com -out installdocker.sh
```

3. Install docker compose

``` bash
sudo pip3 install docker-compose
```

4. Setup containers for database and grafana

docker-compose.yml
``` yml
services:
  db:
    image: mysql/mysql-server
    ports:
      - "5432:5432"
  grafana:
    image: grafana/grafana
    ports:
      - "80:3000"
    
```

Get MySQL root PW
```shell
docker logs db 2>&1 | grep GENERATED
GENERATED ROOT PASSWORD: Axegh3kAJyDLaRuBemecis&EShOs
```

Run sql client inside container
``` shell
docker exec -it db mysql -uroot -p
```

Set root sql pw
``` sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Create SQL user
```sql
CREATE USER 'ksu'@'%' IDENTIFIED WITH mysql_native_password BY 'motorsports';
GRANT ALL PRIVILEGES ON * . * TO 'ksu'@'%';
FLUSH PRIVILEGES;
```
