---
layout: doc
title: "How I am using Refit in .NET Core"
description: "Learn how to simplify API calls in .NET Core using Refit library with auto-generated types and tenant-specific API key handling."
publishDate: 2024-12-18
author: "Kushal Niroula"
editLink: true
head:
  - - meta
    - property: og:image
      content: https://kusalniroula.com.np/using-refit.png
  - - meta
    - property: og:title
      content: "How I am using Refit in .NET Core"
  - - meta
    - property: og:description
      content: "Learn how to simplify API calls in .NET Core using Refit library with auto-generated types and tenant-specific API key handling."
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:image
      content: https://kusalniroula.com.np/using-refit.png
---

# Using Refit!

![Using Refit in .NET Core](/using-refit.png)

# tl;dr
Using `Refit` and `Refitter` can make your API consumption code cleaner and easier. It allows developers to define their API as a C# interface, which Refit then uses to handle the HTTP calls and JSON serialization automatically. This reduces the amount of boilerplate code required when working with APIs, making the developer experience more enjoyable. Refit also provides a way to handle API keys, which can be specific to each tenant, by using a custom HttpMessageHandler. This document provides examples of how to use Refit, including how to auto-generate types using Refitter and how to create a partial interface file to add custom functionality.

> Libraries Used: [Refit](https://github.com/reactiveui/refit) [Refitter](https://github.com/christianhelle/refitter)


# Pain of API consumption
API consumption is a must in todays integration oriented world. We need to communicate with multiple services in order to perform various tasks, and in the .net world, it is often handle via http client.

Http Client is great. It provides a simple api that lets us craft our HTTP requests and handle the HTTP responses. However, it can sometimes be daunting to use it.

Consider this example of API consumption of the countries rest api:

```csharp
var client = new HttpClient
{
    BaseAddress = new Uri("https://restcountries.com/v3.1/")
};

// GET request
var response = await client.GetAsync("all");

// Check status
if (!response.IsSuccessStatusCode)
{
    Console.WriteLine($"Error: {response.StatusCode}");
    return;
}

var json = await response.Content.ReadAsStringAsync();

var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};
var countries = JsonSerializer.Deserialize<List<Country>>(json, options);

foreach (var country in countries!.Take(5)) // Print a few countries
{
    Console.WriteLine(
        $"{country.Name.Common} — {country.Region} — Capital: {string.Join(", ", country.Capital)}");
}
```

This does the job, but it can sometimes be too much boilerplate and takes away from our original intent; get list of countries from the api.

Fortunately for us, there are libraries that make API consumption easier and fun. `Refit` is one such library. It is a wrapper around the `HttpClient` library and adds syntactic sugar that vastly improves the develper experience when consuming APIs.


---

## What is Refit?

**[Refit](https://github.com/reactiveui/refit)** is a small library that simplifies calling APIs in .NET.  
Instead of writing `HttpClient` code for each endpoint and worrying about JSON serialization and errors, Refit lets you define your API as a C# interface. It then handles all the HTTP calls for you automatically.

### Why use Refit?  
Without Refit, you often have to:
- Write a lot of repetitive `HttpClient` code.
- Manually deserialize JSON responses.
- Manually check status codes and errors.

With Refit, you just write an interface and let it do the work. It feels like you’re just calling a local C# method!

---

## Installing Refit

You can add Refit to your project via NuGet:

```bash
dotnet add package Refit
```

That’s it! Once installed, you can start creating your API interfaces.

---

## Using Refit

Here’s a quick example of a Refit interface:

```csharp
using Refit;

public interface ISomeApiService
{
    [Get("/weather")]
    Task<ApiResponse<WeatherInfo>> GetWeatherAsync();
}
```

And then register the client in your DI setup:

```csharp
builder.Services.AddRefitClient<ISomeApiService>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://my.api.com"));
```

You can then inject `ISomeApiService` into your classes and call its methods like they’re just regular C# methods!

---

## How I use Refit

In my own project, I do a few extra things to make this even easier.

### Auto-generate types with Refitter

I use a tool called **[Refitter](https://github.com/christianhelle/refitter)** to auto-generate my API interfaces and types straight from an OpenAPI/Swagger file.  
Here’s the command I use:

```bash
refitter --namespace "My.Project.RefitConfig" --output ../My.Project/RefitConfig/ISomeApiService.Generated.cs --use-api-response
```

This:
- Sets the namespace to `My.Project.RefitConfig`.
- Outputs the generated file as `ISomeApiService.Generated.cs`.
- Uses `ApiResponse<T>` so I can inspect status codes.

### My partial interface file

I also keep my own partial interface file (`ISomeApiService.cs`) in my codebase.  
That file looks like this:

```csharp
namespace My.Project.RefitConfig;

public partial interface ISomeApiService
{
    // Here I can add helper methods, comments, or other customizations.
}
```

That way, the generated file and my file share the same interface via the `partial` keyword, so C# merges them together.

---

## Handling API Keys (Per Tenant)

Some APIs require an API key, which can even depend on the current tenant.  
In these cases, we can use an `HttpMessageHandler` with Refit:

Here’s a custom handler that adds the header:

```csharp
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class SomeApiServiceApiKeyHandler(
    IOptions<UtilityApiConfig> config,
    ICurrentTenant currentTenant) : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var apiKey = GetApiKeyByTenantId(currentTenant.GetId());
        request.Headers.Add("x-some-api-key", apiKey);       
        return await base.SendAsync(request, cancellationToken);
    }

    private string GetApiKeyByTenantId(string? tenantId)
    {
        // Logic to get the correct API key per tenant.
        return config.Value.ApiKeys[tenantId];
    }
}
```

And then register your client like this:

```csharp
services.AddRefitClient<ISomeApiService>()
    .ConfigureHttpClient((sp, client) =>
    {
        client.BaseAddress = new(sp.GetRequiredService<IOptions<SomeApiConfig>>().Value.Url);
    })
    .AddHttpMessageHandler<SomeApiServiceApiKeyHandler>();
```

With this setup:
- Every outgoing request will include the correct API key.
- You can manage per-tenant configurations easily.

---

## Example

Here’s a simple example of using Refit to call a public REST API. Let’s say we want to fetch some country data.

```csharp
// Define interface that describe the endpoints

// ICountriesApi.cs
using Refit;

public interface ICountriesApi
{
    [Get("/all")]
    Task<ApiResponse<List<CountryDto>>> GetAllCountriesAsync();

    [Get("/alpha/{code}")]
    Task<ApiResponse<CountryDto>> GetCountryByCodeAsync(string code);
}

// Define the DTOs

public class CountryDto
{
    public string Name { get; set; }
    public string Region { get; set; }
    public int Population { get; set; }
}

// Register the DI Service
builder.Services.AddRefitClient<ICountriesApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://restcountries.com/v3.1"));


// Using it in other services
public class CountryService(ICountriesApi countriesApi)
{
    public async Task PrintCountriesAsync()
    {
        var response = await countriesApi.GetAllCountriesAsync();
        if (response.IsSuccessStatusCode)
        {
            var countries = response.Content;
            foreach (var country in countries.Take(5)) // Just take a few
            {
                Console.WriteLine($"{country.Name} ({country.Region}), Population: {country.Population}");
            }
        }
        else
        {
            Console.WriteLine("Error fetching countries: " + response.Error?.Message);
        }
    }
}


```

With refitter, the DTOs and the interfaces are generated automatically. No need to create them manually and keep them in sync manually. Just regenerate them using refitter once the API changes and you have all the new methods/changed methods available to you as a C# typed methods.

---

## Conclusion

With [Refit](https://github.com/reactiveui/refit) and [Refitter](https://github.com/christianhelle/refitter):
- I don’t have to write `HttpClient` boilerplate.
- My types stay up to date with my API.
- Handling tenant-specific API keys is straightforward.

If you’re tired of manually writing HTTP client calls and dealing with authentication headers, give Refit a try—it simplifies things a lot!