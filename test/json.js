import 'traceur'
import { 
  streamToJson, buffersToStream, textToStreamable,
  jsonToStreamable, streamableToJson
} from '../lib/stream-convert.js'

var should = require('should')

var originalJson = {
  "foo": "testing 123",
  "bar": [
    "a", "b"
  ]
}

var testJson = function(json) {
  json.foo.should.equal('testing 123')
  json.bar[0].should.equal('a')
  json.bar[1].should.equal('b')
}

var testBuffers = [
  '{ "fo', 'o": "', 'testing ', '123", ', '"bar', '": [ ',
  '"a", "b', '"] }' 
]

describe('basic json test', function() {
  it('sanity test with original content', () => 
    testJson(originalJson))

  it('sanity test with test buffers', () =>
    testJson(JSON.parse((testBuffers.join('')))))

  it('should parse json correctly', () =>
    streamToJson(buffersToStream(testBuffers)).then(testJson))

  it('should convert json to streamable', () => {
    var streamable = jsonToStreamable(originalJson)
    streamable.contentType.should.equal('application/json')

    return streamable.toStream().then(streamToJson).then(testJson)
  })

  it('should convert text to streamble', () => {
    var jsonText = JSON.stringify(originalJson)
    var streamable = textToStreamable(jsonText)

    return streamableToJson(streamable).then(testJson)
  })
})
