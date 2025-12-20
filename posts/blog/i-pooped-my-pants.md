# I Pooped My Pants

_January 2025_

This post exists to test everything.

If this renders correctly, the blog system is finished.

---

## Basic text

Plain paragraph text should wrap naturally and respect the content width.

Line breaks  
should  
only  
happen  
when  
intended.

---

## Emphasis

Italic text  
**Bold text**  
***Bold and italic***

Inline code example: `npm install marked`

Strikethrough example:  
~~this text should be crossed out~~

---

## Headings

### Heading level 3
#### Heading level 4
##### Heading level 5

You probably will not need deeper than this.

---

## Lists

### Unordered list

- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

### Ordered list

1. First item
2. Second item
3. Third item
   1. Nested item
   2. Nested item again

---

## Links

External link: [Jellyfin](https://jellyfin.org)  
Internal link: [Back to blog](/blog/)

Autolink example:  
https://tyler-walker.com

---

## Images

Standard image test:

![Test image](/images/blog/example.png)

If the image does not exist, it should fail gracefully.

---

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.
>
> Useful for pulling out thoughts or references.

---

## Code blocks

Plain code block:

```
docker compose up -d
```

JavaScript example:

```js
const slug = location.pathname
  .replace(/\/$/, '')
  .split('/')
  .pop();

console.log(slug);
```

Python example:

```python
def hello():
    print("Hello, world")
```

Shell example:

```bash
ls -la /posts/blog
```

---

## Tables

| Column A | Column B | Column C |
|----------|----------|----------|
| One      | Two      | Three    |
| Four     | Five     | Six      |

---

## Horizontal rules

---

Another section after a horizontal rule.

---

## HTML inside markdown

Sometimes you want to break out of markdown.

<div style="padding: 1rem; border: 1px solid rgba(255,255,255,0.2);">
This is raw HTML inside markdown.<br>
It should render normally.
</div>

---

## Escaping characters

These characters should not break rendering:

\* \_ \` \# \> \|

---

## Task lists

- [x] Clean URLs
- [x] Markdown rendering
- [x] Previous and next navigation
- [ ] World domination

---

## Nested content torture test

> Blockquote with code inside it:
>
> ```js
> console.log("nested");
> ```

- List item with code:
  ```bash
  echo "inside list"
  ```

---

## Final sanity check

If you can read this post and everything above renders correctly:

- Headings
- Lists
- Images
- Code blocks
- Tables
- Links
- HTML
- Blockquotes

Then the system is not just working, it is done.

No CMS.  
No build step.  

You write markdown.  
The site renders it.
