---
title: "Making HTTP request in Java"
description: "Using java.net package"
pubDate: "06/21/2023"
updatedDate: "06/21/2023"
heroImage: "https://source.unsplash.com/tNALoIZhqVM"
---

When doing microservices development in Java, it is common that we need to call an HTTP
request to another server. In Spring Boot application, we can use the `RestTemplate`,
as shown in [this article](https://medium.com/%E7%A8%8B%E5%BC%8F%E8%A3%A1%E6%9C%89%E8%9F%B2/spring-boot-send-url-request-4adea7de9d7c).

In this blog, we mainly focus on the approach using only vanilla Java packages.
We use utils from java.net package, but the usage is a bit more complicated than other
frameworks (such as axios in JavaScript). Here is a code snippet for quick reference.

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/* ... */

    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://localhost:8080/api/v1/aRandomAPI"))
        .POST(HttpRequest.BodyPublishers.ofString(new GsonBuilder()
            .setPrettyPrinting()
            .create()
            .toJson(aRandomObject)))
        .setHeader("Content-Type", "application/json")
        .build();
    try {
        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());
        ResponseClass responseBody = new Gson()
            .fromJson(response.body(),
                ResponseClass.class);
        return responseBody;
    } catch (Exception e) {
        return null;
    }

/* ... */
```
