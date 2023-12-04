---
title: "The println macro in Rust"
description: "common usage in detail"
pubDate: "06/23/2023"
updatedDate: "06/23/2023"
heroImage: "https://source.unsplash.com/QfmM3JrHtog"
---

The `println!` macro in Rust is powerful, the following are some common use cases.

1. Placeholder `{}` for any data type.
   ```rust
   println!("First: {}, Second: {}, Third: {}.", "a", 1, true);
   ```
   The output:
   ```
   First: a, Second: 1, Third: true.
   ```
2. [Traits](https://doc.rust-lang.org/book/ch10-02-traits.html)
   for numbers
   `rust
 println!("Binary: {:b} Hex: {:x} Octal: {:o}", 10, 10, 10);
 `
   The output:
   `     Binary: 1010 Hex: a Octal: 12
 `
3. A "tuple" of values
   ```rust
   println!("{:?}", (10, true, "text"));
   ```
   The output:
   ```
   (10, true, "text")
   ```
