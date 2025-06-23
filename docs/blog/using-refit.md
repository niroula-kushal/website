# How I am using Refit in .NET Core

When working with APIs, writing all the `HttpClient` code by hand can feel boring. That’s where **Refit** comes in. In this article, I’ll show you what Refit is, why it’s helpful, and how I use it in my own project.

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

## Conclusion

With [Refit](https://github.com/reactiveui/refit) and [Refitter](https://github.com/christianhelle/refitter):
- I don’t have to write `HttpClient` boilerplate.
- My types stay up to date with my API.
- Handling tenant-specific API keys is straightforward.

If you’re tired of manually writing HTTP client calls and dealing with authentication headers, give Refit a try—it simplifies things a lot!