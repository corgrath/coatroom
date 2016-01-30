/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 */

var fs = require( "fs" );
var nodePath = require( "path" );
var EOL = require( "os" ).EOL;

var mkdirp = require( "mkdirp" );

var assert = require( "../utils/argument-assertion-util.js" );
var stringUtil = require( "../utils/string-util.js" );
var logUtil = require( "../utils/log-util.js" );

module.exports.createFolderStructure = function( path ) {

    if ( module.exports.directoryExists( path ) ) {

        logUtil.log( "FileService", "The path structure \"" + path + "\" is already created." );

    } else {

        logUtil.log( "FileService", "Creating path structure \"" + path + "\"." );

        mkdirp.sync( path );

    }

};

module.exports.isFile = function( file ) {

    return fs.existsSync( file ) && fs.lstatSync( file ).isFile();

};

module.exports.directoryExists = function log( directory ) {

    return fs.existsSync( directory ) && fs.lstatSync( directory ).isDirectory();

};

module.exports.readFile = function( file ) {

    if ( !assert.isString( file ) ) {
        throw new Error( "File is not a string." );
    }

    if ( !module.exports.isFile( file ) ) {
        throw new Error( "\"" + file + "\" is not a file." );
    }

    if ( fs.existsSync( file ) ) {

        var data = fs.readFileSync( file, "UTF-8" );

        logUtil.log( "FileService", "Read \"" + Buffer.byteLength( data, "UTF-8" ) + "\" bytes from the file \"" + file + "\"." );

        return data;

    } else {

        throw new Error( "Could not find the file \"" + file + "\"." );

    }

};

module.exports.join = function log() {

    return nodePath.join.apply( null, arguments );

};

module.exports.getAllItemsInDirectory = function( directory ) {

    if ( !module.exports.directoryExists( directory ) ) {
        throw new Error( "The directory \"" + directory + "\" does not exist." );
    }

    var items = fs.readdirSync( directory );

    return items;

};

module.exports.getAllFilesInDirectory = function( directory, extension ) {

    var files = [];

    var items = module.exports.getAllItemsInDirectory( directory );

    for ( var i in items ) {

        var item = items[ i ];

        if ( module.exports.isFile( directory + nodePath.sep + item ) ) {

            if ( !extension || stringUtil.endsWith( item, extension ) ) {
                files.push( item );
            }

        }

    }

    return files;

};

module.exports.isDirectory = function( directory ) {

    return fs.existsSync( directory ) && fs.lstatSync( directory ).isDirectory();

};

module.exports.getAllDirectories = function( directory ) {

    var directories = [];

    var items = module.exports.getAllItemsInDirectory( directory );

    for ( var i in items ) {

        var item = items[ i ];

        if ( module.exports.isDirectory( nodePath.join( directory, item ) ) ) {
            directories.push( item );
        }

    }

    return directories;

};

module.exports.writeFile = function( file, contents ) {

    assert.isString( contents, "contents" );

    var path = nodePath.dirname( file );
    module.exports.createFolderStructure( path );

    fs.writeFileSync( file, contents );

    logUtil.log( "FileService", "Wrote \"" + Buffer.byteLength( contents, "UTF-8" ) + "\" bytes to the file \"" + file + "\"." );

};

module.exports.concatenate = function( files ) {

    var concatenation = "";

    files.forEach( function( file ) {

        if ( !module.exports.isFile( file ) ) {
            throw new Error( "\"" + file + "\" is not a file." );
        }

        var contents = module.exports.readFile( file );

        concatenation += contents + EOL;

    } );

    return concatenation;

};
