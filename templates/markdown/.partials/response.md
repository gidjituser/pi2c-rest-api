{{#unless hideTitle}}
#### {{responseName}}
{{/unless}}

{{#if response.content}}
{{#each response.content as |content contentType|}}
###### {{contentType}}
{{#if content.description}}
{{{content.description}}}
{{/if}}
{{> schema schema=content.schema schemaName='Response' hideTitle=true hideExamples=true}}

{{#if content.schema.example}}
##### Example
{{#equal contentType 'application/json'}}
```json
{{{stringify content.schema.example}}}
```
{{else}}
{{#equal contentType 'application/xml'}}
```xml
{{{content.schema.example}}}
```
{{else}}
```
{{{content.schema.example}}}
```
{{/equal}}
{{/equal}}
{{else}}
{{#if content.generatedExample}}
##### Example _(generated)_

```json
{{{stringify content.generatedExample}}}
```
{{/if}}
{{/if}}
{{/each}}
{{/if}}
