import 'traceur'
import { 
  streamableToText, buffersToStreamable, reuseStream, streamToBuffers
} from '../lib/stream-convert.js'
var should = require('should')

var testBuffers = [ 'foo', 'bar', 'baz' ]

describe('basic buffer test', () => {
  var streamable = buffersToStreamable(testBuffers)

  it('should convert buffers to stream', () =>
    streamable.toStream().then(readStream =>
      readStream.read().then(({closed, data}) => {
        data.should.equal(testBuffers[0])

        return readStream.read().then(({closed, data}) => {
          data.should.equal(testBuffers[1])

          return readStream.read().then(({closed, data}) => {
            data.should.equal(testBuffers[2])

            return readStream.read().then(({closed, data}) => 
              should.exist(closed))
          })
        })
      })))

  it('should be convertible to string', () =>
    streamableToText(streamable).then(text =>
      text.should.equal('foobarbaz')))

  it('convert buffers stream into reusable streamable', () =>
    streamable.toStream().then(reuseStream)
    .then(streamable => 
      streamable.toStream().then(streamToBuffers)
      .then(buffers => {
        buffers.should.eql(testBuffers)
        
        // call toStream() again
        return streamable.toStream().then(streamToBuffers)
        .then(buffers => buffers.should.eql(testBuffers))
      })))
})