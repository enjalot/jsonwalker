## Usage

### node script
modify index.js to choose the mongo collection

```
npm install
node index.js
```


##NOTES

I'm implementing this as a Mongo mapreduce at first because that's where my
data is.  This should be generalizable to any collection of JSON objects. Would
just need to pull the functions out and provide a mapreduce interface on an
array.
