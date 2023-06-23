---
title: "Data types in Rust"
description: "Data types in Rust"
pubDate: "06/23/2023"
updatedDate: "06/23/2023"
heroImage: "https://source.unsplash.com/QfmM3JrHtog"
---

<!--toc:start-->
- [Primitive Types](#primitive-types)
  - [Default types of implicit definition](#default-types-of-implicit-definition)
  - [Max size](#max-size)
- [Strings](#strings)
- [Tuples](#tuples)
- [Arrays](#arrays)
- [Vectors](#vectors)
<!--toc:end-->

## Primitive Types

Integers: i8, u8, i16, u16, i32, u32, i64, u64, i128, u128.

Floats: f32, f64.

Boolean

Character: wrapped by `''`
```rust
let character = 'a';
```

Note that
```rust
let character2 = "b";
```
is not a char, it's a `&str` instead.

### Default types of implicit definition

```rust
let a = 1;  // default is i32
```

```rust
let b = 2.5;  // default is f64
```

### Max size

```rust
println!("Max i32: {}", std::i32::MAX);
```
result is:
```
Max i32: 2147483647
```

## Strings

> There are two types of strings in rust
> - Immutable, fixed-length strings stored in the stack.
> - Growable strings allocated from heap.

Functions they have in common:
- `.len()`: returns the length
- `.contains()`: pass in substring, returns if contains it
- `.replace()`: replace substring
- and many more

What `String` have in addition:
- `.push()`: takes in a char, append it to the `String`
- `.push_str()`: takes in a immutable string, and append it

## Tuples

> A collection of data that can have different types.

```rust
let person: (&str, &str, i8) = ("3DRX", "Beijing", 20);
println!("{} is from {} and is {} years old.",
         person.0, person.1, person.2);
```

The result:

```
3DRX is from Beijing and is 20 years old.
```

## Arrays

> A collection of data that have same types, fixed length, stack allocated.

```rust
let numbers: [i32; 5] = [1, 2, 3, 4, 5];
println!("{:?}", numbers);
println!("The first number: {:?}.", numbers[0]);
```

The result:

```
[1, 2, 3, 4, 5]
The first number: 1.
```

Note that you have to use `{:?}` to print an entire tuple or array.

Common functions of array:
- `.len()`: the length
- To get the size of memory used by an array
    ```rust
    let size_in_bytes: usize = std::mem::size_of_val(&my_array);
    ```

Slice of array:

```rust
let slice_of_numbers = &numbers[0..2];
println!("The slice: {:?}.", slice_of_numbers);
```

The output is:

```
The slice: [1, 2].
```

## Vectors

```rust
let num_vec: Vec<i32> = vec![1, 2, 3, 4, 5];
```

Vectors have all the features of array, and when set to `mut`,
they have `.push()` and `.pop()` functions.

