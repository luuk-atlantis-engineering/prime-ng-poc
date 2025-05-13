# 🌐 Translation Contribution Guideline


### `ngx-translate` Naming Conventions

Documentation: [https://ngx-translate.org/](https://ngx-translate.org/)

This guide provides concise steps and examples to help you maintain clear, consistent translation in your project.

---

## Why Custom i18n IDs?

Custom IDs improve clarity, maintainability, and translator context.

Follow these guidelines when contributing:

### 🔹 **General Guidelines**

- **Uniqueness:** Use globally unique IDs.
- **Context:** Include component or page context.
- **Consistency:** Use lowercase, dot-separated notation (`component.element.action`).
- **Meaning:** IDs describe purpose, not the exact text.

---

### 🔹 **Recommended Patterns**

- **Page/Component Context:** `component.element.descriptive_text-attribute&plural|variable`
    - `demo.h1.welcome_text-title|gender`
    - `demo.list.empty_message`
    - `demo.list.empty_message-title&plural|name`
- **Global/Common keys:** For reused strings
    - `common.ok`
    - `common.cancel`


## 🚨 **Do's and Don'ts**

✅ **Good IDs:**

- `demo.edit.title`
- `common.submit`

❌ **Bad IDs:**

- `title1` (no context)
- `submitButton2` (numeric suffix)


## **Examples of Usage**

🚩 **Examples of Usage**

### 🔸 **Simple translation:**

```html
<h1>{{ "home.introHeader" | translate }}</h1>
```

### 🔸 **Interpolated values:**

```html
<p>{{ 'demo.p.hello|name|lastname' | translate:{ name: name, lastname: lastname } }}</p>
```

### 🔸 **With HTML attributes:**

```html
<h1 [title]="'demo.h1.introHeader-title' | translate">
  {{ "demo.h1.introHeader" | translate }}
</h1>
```

### 🔸 **Dynamic translation message in component:**

```
introMessage = this.translatePipe.transform('demo.p.hello|name|lastname',{ name: name, lastname: lastname });
```

### 🔸 **Language switch dropdown example:**

```html
<p-dropdown [options]="languages"
            [(ngModel)]="selectedLanguage"
            placeholder="Select a Language"
            (onChange)="switchLanguage($event)">
</p-dropdown>
```

```tsx
name = 'John';
lastname = 'Doe';

languages = [
  { label: 'English', value: 'en' },
  { label: 'Greek', value: 'el' },
];

selectedLanguage = 'el';

switchLanguage(event: any) {
  this.translateService.use(event.value);
}
```

## 🚧 **Common Pitfalls:**

- Avoid embedding actual English text in IDs.
- Don’t reuse the same ID in different contexts unless the meaning is truly identical.


## ✅ **Good Example:**

```html
<!-- Simple translation for attribute title -->
<h1 [title]="'demo.h1.introHeader-title' | translate">
  {{ "demo.h1.introHeader" | translate }}
</h1>

<!-- Interpolation example -->
<p>{{ 'demo.p.hello|name|lastname' | translate:{ name: name, lastname: lastname } }}</p>

<!-- Pluralization example, need to add to translation 1 with &plural key name -->
@let plural = items.length !== 1 ? "&plural" : "";
<p>{{ 'demo.p.items' + plural + '|name|lastname|itemsNumber' | translate: { 
	name: name, 
	lastname: lastname,
	itemsNumber: items.length 
	} }}</p>

<!-- Dynamic string -->
<p> {{ 'demo.p.introHeaderNGXMessage' | translate }} </p>
<pre class="ml-5">{{ introHeaderNGXMessage }}</pre>
```


## 🛠️ **Translation files:**

### 🔹 **Translation File Format:**

Example: `assets/i18n/en.json`

```json
{
  "demo": {
    "h1": {
      "introHeader": "Hello i18n!",
      "introHeader-title": "Header Title"
    },
    "p": {
      "hello|name|lastname": "Hello {{name}} {{lastname}}!",
      "introHeaderNGXMessage": "This is a dynamically translated message.",
		  "items&plural|name|lastname|itemsNumber": "{{name}} {{lastname}} has {{itemsNumber}} items ",
		  "items|name|lastname|itemsNumber": "{{name}} {{lastname}} has {{itemsNumber}} item",
    }
  },
  "common": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}
```

For Greek: `assets/i18n/el.json`

```json
{
  "demo": {
    "h1": {
      "introHeader": "Γεια σου i18n!",
      "introHeader-title": "Τίτλος Κεφαλίδας"
    },
    "p": {
      "hello|name|lastname": "Γεια σου {{name}} {{lastname}}!",
      "introHeaderNGXMessage": "Αυτό είναι ένα δυναμικά μεταφρασμένο μήνυμα.",
      "items&plural|name|lastname|itemsNumber": "{{name}} {{lastname}} έχει {{itemsNumber}} αντικείμενα",
		  "items|name|lastname|itemsNumber": "{{name}} {{lastname}} έχει {{itemsNumber}} αντικείμενο"
    }
  },
  "common": {
    "submit": "Υποβολή",
    "cancel": "Ακύρωση"
  }
```

---

Follow the naming and structure guidelines consistently for scalable and maintainable i18n support using `ngx-translate`.
