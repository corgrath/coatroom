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

module.exports.startsWith = function startsWith( string, prefix ) {
	return string.slice( 0, prefix.length ) == prefix;
};

module.exports.endsWith = function endsWith( str, suffix ) {
	return str.indexOf( suffix, str.length - suffix.length ) !== -1;
};

module.exports.contains = function contains( str, needle ) {
	return str.indexOf( needle ) !== -1;
};
