---
layout: doc
title: "Handling Nulls in EF Core Left Joins: Simplified with Nullable Properties"
description: "Learn how EF Core simplifies null handling in left joins by leveraging nullable properties, reducing boilerplate code, and avoiding runtime exceptions."
date: 2024-12-16
publishDate: 2024-12-16
author: "Kushal Niroula"
editLink: true
---

# Handling Nulls in EF Core Left Joins: Simplified with Nullable Properties

Entity Framework Core (EF Core) provides robust support for performing left joins. However, handling null values from the right side of the join can lead to issues if not managed properly. This article explores how EF Core simplifies null handling when the target model's properties are nullable, eliminating the need for redundant null checks.

## Understanding Left Joins in EF Core

A **left join** ensures that all records from the left table are included in the result, along with matching records from the right table. If no match is found, the right table's columns are `null`.

Let's consider an example:

```csharp
public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = null!;
}

public class Invoice
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public decimal? Amount { get; set; }
}
```

We want to join `Order` with `Invoice` to get a list of orders along with their invoices, if any.

## The Problem: Handling Nulls Explicitly

When performing a left join, EF Core may return `null` for the right side of the join. If we use the result in a `Select` statement without proper null handling, we might encounter a runtime exception:

> `System.NullReferenceException: Object reference not set to an instance of an object.`

Here's how the issue arises:

```csharp
var result = from order in _dbContext.Orders
             join invoice in _dbContext.Invoices
             on order.Id equals invoice.OrderId into invoices
             from invoice in invoices.DefaultIfEmpty()
             select new
             {
                 OrderId = order.Id,
                 InvoiceAmount = invoice.Amount // Potential null reference
             };
```

If `invoice` is `null`, accessing `invoice.Amount` will throw an exception.

### Traditional Solution

To prevent this, we often use a conditional operator to handle nulls explicitly:

```csharp
var result = from order in _dbContext.Orders
             join invoice in _dbContext.Invoices
             on order.Id equals invoice.OrderId into invoices
             from invoice in invoices.DefaultIfEmpty()
             select new
             {
                 OrderId = order.Id,
                 InvoiceAmount = invoice != null ? invoice.Amount : null
             };
```

While this works, it introduces verbosity and manual checks for null values.

## Simplification: Leverage Nullable Properties

If the target model has nullable properties, EF Core automatically maps `null` values correctly without requiring additional checks. For instance, consider the following target model:

```csharp
public class OrderWithInvoice
{
    public int OrderId { get; set; }
    public decimal? InvoiceAmount { get; set; }
}
```

Now, the query simplifies:

```csharp
var result = from order in _dbContext.Orders
             join invoice in _dbContext.Invoices
             on order.Id equals invoice.OrderId into invoices
             from invoice in invoices.DefaultIfEmpty()
             select new OrderWithInvoice
             {
                 OrderId = order.Id,
                 InvoiceAmount = invoice.Amount
             };
```

### Why It Works

When the property `InvoiceAmount` in `OrderWithInvoice` is defined as `decimal?`, EF Core understands that it can accept `null`. This removes the need for manual null checks and keeps the code concise and clean.

## Key Takeaways

- **Nullable Properties Simplify Null Handling:** When the target model's properties are nullable, EF Core automatically handles nulls, reducing the risk of runtime exceptions.
- **Avoid Redundant Null Checks:** We don’t need to write conditional expressions like `value != null ? value : null` if the property in our model is nullable.
- **Write Cleaner Code:** Using nullable properties in our target models improves readability and maintainability.

By leveraging EF Core's understanding of nullable properties, we can simplify our queries, reduce boilerplate code, and avoid common pitfalls with null handling in left joins.
