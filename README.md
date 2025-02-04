# js-callback-example

Example run:

```
❯ node index.ts
(node:13480) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Sleeping 100ms...
Server listening on port 3000
Calling getKey with key 'foo'.
Sleeping 5ms...
Calling getKey with key 'bar'.
Sleeping 5ms...
Calling getKey with key 'foo'.
Sleeping 100ms...
Made network request with URL http://localhost:3000/read?keys=foo,bar
Calling getKey with key 'baz'.
Sleeping 2000ms...
Made network request with URL http://localhost:3000/read?keys=baz
I'm callback 'cb1' set for key 'foo' and I was called with value '42340234'
I'm callback 'cb3' set for key 'foo' and I was called with value '42340234'
I'm callback 'cb2' set for key 'bar' and I was called with value '29384092834'
I'm callback 'cb4' set for key 'baz' and I was called with value '2934'
Calling getKey with key 'foo'.
Sleeping 5ms...
Calling getKey with key 'bar'.
Sleeping 5ms...
Calling getKey with key 'foo'.
Sleeping 100ms...
Made network request with URL http://localhost:3000/read?keys=foo,bar
Calling getKey with key 'foo'.
Sleeping 2000ms...
I'm callback 'cb1' set for key 'foo' and I was called with value '42340234'
I'm callback 'cb3' set for key 'foo' and I was called with value '42340234'
I'm callback 'cb4' set for key 'foo' and I was called with value '42340234'
I'm callback 'cb2' set for key 'bar' and I was called with value '29384092834'
```
