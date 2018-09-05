describe "The d-tree component", ->

  it "is a function", ->

    dtree = require "../src/getdirtree"
    expect(typeof dtree).to.eql "function"
    expect(dtree).to.be.an.instanceof Function

  it "takes a filesystem path and returns a flat object", ->

    path = require 'path'
    dtree = require path.join(__dirname, '../src/getdirtree')
    # pathToTestFolder = path.join(__dirname, '../testOrdner')
    pathToTestFolder = path.join(__dirname, '../test_folder')
#        dtree(pathToTestFolder).then (result) ->
#            console.log JSON.stringify result
    dtree(pathToTestFolder, {flat: true})
      .then (result) ->
        expect(result).to.deep.equal [
          "name": "blubb"
          "path": pathToTestFolder+"/blubb"
          "type": "folder"
        ,
          "name": "test"
          "path": pathToTestFolder+"/test"
          "type": "file"
        ,
          "name": "test"
          "path": pathToTestFolder+"/blubb/test"
          "type": "file"
        ]


  it "takes a filesystem path and returns a nested object", ->

    path = require 'path'
    dtree = require path.join(__dirname, '../src/getdirtree')
    # pathToTestFolder = path.join(__dirname, '../testOrdner')
    pathToTestFolder = path.join(__dirname, '../test_folder')
#        dtree(pathToTestFolder).then (result) ->
#            console.log JSON.stringify result
    dtree(pathToTestFolder)
      .then (result) ->
        expect(result).to.deep.equal
          "name":"test_folder"
          "path": pathToTestFolder
          "type":"folder"
          "content": [
              "name": "blubb"
              "path": pathToTestFolder+"/blubb"
              "type": "folder"
              "content": [
                  "name": "test"
                  "path": pathToTestFolder+"/blubb/test"
                  "type": "file"
              ]
          ,
              "name": "test"
              "path": pathToTestFolder+"/test"
              "type": "file"
          ]
