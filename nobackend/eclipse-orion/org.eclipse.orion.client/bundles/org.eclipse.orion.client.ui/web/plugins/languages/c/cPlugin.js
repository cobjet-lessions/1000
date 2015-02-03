/*******************************************************************************
 * @license
 * Copyright (c) 2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*eslint-env browser, amd*/
define(['orion/plugin', 'orion/editor/stylers/text_x-csrc/syntax'], function(PluginProvider, mC) {

	function connect() {
		var headers = {
			name: "Orion C Tool Support",
			version: "1.0",
			description: "This plugin provides C tools support for Orion."
		};
		var pluginProvider = new PluginProvider(headers);
		registerServiceProviders(pluginProvider);
		pluginProvider.connect();
	}

	function registerServiceProviders(pluginProvider) {
		pluginProvider.registerServiceProvider("orion.core.contenttype", {}, {
			contentTypes: [
				{	id: "text/x-csrc",
					"extends": "text/plain",
					name: "C",
					extension: ["c", "h"]
				}
			] 
		});
		pluginProvider.registerServiceProvider("orion.edit.highlighter", {}, mC.grammars[mC.grammars.length - 1]);
	}

	return {
		connect: connect,
		registerServiceProviders: registerServiceProviders
	};
});