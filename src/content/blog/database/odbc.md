---
title: "Connect to GaussDB and PostgreSQL using ODBC on Linux(Debian)"
description: "在 Linux(Debian) 上使用 ODBC 连接 GaussDB 与 PostgreSQL"
pubDate: "12/3/2023"
updatedDate: "12/5/2023"
heroImage: ""
---

## 安装软件包

```
sudo apt install odbc-postgresql unixodbc unixodbc-dev
```

## 修改配置文件

/etc/odbc.ini

> 此处 Driver 名字要和下面 `odbcinst.ini` 中 "[]" 里的名字相同

```ini
[PostgreSQL Unicode]
Driver      = PostgreSQL Unicode
Database    = <db name>
Servername  = <db server ip>
UserName    = <user name>
Password    = <password>
Port        = <port>
```

/etc/odbcinst.ini

```ini
[PostgreSQL ANSI]
Description=PostgreSQL ODBC driver (ANSI version)
Driver=psqlodbca.so
Setup=libodbcpsqlS.so
Debug=0
CommLog=1
UsageCount=1

[PostgreSQL Unicode]
Description=PostgreSQL ODBC driver (Unicode version)
Driver=psqlodbcw.so
Setup=libodbcpsqlS.so
Debug=0
CommLog=1
UsageCount=1
```

## GaussDB only

Download gsql [here](https://support.huaweicloud.com/mgtg-dws/dws_01_0032.html)
(for Debian 12, I use the dws_client_8.1.x_redhat_x64 package),
decompress it and cd into the dir.
```
source ./gsql_env.sh
```
This script replaces certain .so in PATH,
and won't have permanent effect on system libraries.

## Connect using pyodbc

```
pip install pyodbc
```

```python
import pyodbc

if __name__ == "__main__":
    con = pyodbc.connect(
        driver="PostgreSQL Unicode",
        database="xxx",
        server="xxx",
        port=xxxx,
        uid="xxx",
        pwd="xxx",
    )
    cur = con.cursor()
    cur.execute("SET SEARCH_PATH = test_schema;")
    print(cur.execute("SHOW SEARCH_PATH;").fetchall())
    cur.execute("DROP TABLE IF EXISTS testtable;")
    cur.execute("CREATE TABLE testtable(id int);")
    cur.execute("INSERT INTO testtable values(25)")
    res = cur.execute("SELECT * FROM testtable;").fetchall()
    print(res)
    con.commit()
    cur.close()
    con.close()
    pass
```

Execute the code.

```
$ python3 ./src/main.py
[('test_schema',)]
[(25,)]
```

## Reference

https://support.huaweicloud.com/mgtg-dws/dws_01_0086.html

https://www.postgresql.org/docs/current/
